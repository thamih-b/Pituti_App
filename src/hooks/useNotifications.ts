// src/hooks/useNotifications.ts — NOVO FICHEIRO


import { useMemo, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePetsContext } from '../context/PetsContext'
import { useCares, isDueOnDate } from '../context/CaresContext'
import { useVaccinesContext } from '../context/VaccinesContext'
import { useMedications } from '../context/MedicationsContext'
import { useSymptoms } from '../context/SymptomsContext'

export interface AppNotification {
  id: string
  type: 'vaccine' | 'medication' | 'symptom' | 'care' | 'system'
  title: string
  body: string
  time: string
  read: boolean
  to?: string
}

const READ_KEY = 'pituti-notif-read'

function loadReadIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]')) }
  catch { return new Set() }
}
function persistReadIds(ids: Set<string>) {
  try { localStorage.setItem(READ_KEY, JSON.stringify([...ids])) } catch {}
}

const DAY = 86_400_000

export function useNotifications() {
  const { t } = useTranslation()
  const { pets } = usePetsContext()
  const { items: cares } = useCares()
  const { vaccinesByPet } = useVaccinesContext()
  const { medications } = useMedications()
  const { symptoms } = useSymptoms()

  const [readIds, setReadIds] = useState<Set<string>>(() => loadReadIds())
  useEffect(() => { persistReadIds(readIds) }, [readIds])

  const petName = useCallback(
    (petId: string) => pets.find(p => p.id === petId)?.name ?? '',
    [pets]
  )

  const notifs = useMemo<AppNotification[]>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    const list: AppNotification[] = []

    // ── Vacinas: atrasadas ou a vencer nos próximos 7 dias ──
    Object.entries(vaccinesByPet).forEach(([petId, vaccines]) => vaccines.forEach(v => {
      if (!v.nextDate) return
      const next = new Date(v.nextDate + 'T00:00:00')
      const diffDays = Math.round((next.getTime() - today.getTime()) / DAY)
      if (diffDays > 7) return
      const late = diffDays < 0
      list.push({
        id: `vaccine:${v.id}`,
        type: 'vaccine',
        title: late ? t('notif.vaccineLate', { defaultValue: 'Vacina atrasada' })
                     : t('notif.vaccineSoon', { defaultValue: 'Vacina a vencer' }),
        body: `${petName(petId)} — ${v.name}`,
        time: v.nextDate,
        read: readIds.has(`vaccine:${v.id}`),
        to: `pets/${petId}`,
      })
    }))

    // ── Medicamentos: a terminar nos próximos 3 dias ──
    medications.forEach(m => {
      if (m.archived || !m.endDate) return
      const end = new Date(m.endDate + 'T00:00:00')
      const diffDays = Math.round((end.getTime() - today.getTime()) / DAY)
      if (diffDays < 0 || diffDays > 3) return
      list.push({
        id: `medication:${m.id}`,
        type: 'medication',
        title: t('notif.medEnding', { defaultValue: 'Medicamento a terminar' }),
        body: `${petName(m.petId)} — ${m.title}`,
        time: m.endDate,
        read: readIds.has(`medication:${m.id}`),
        to: `pets/${m.petId}`,
      })
    })

    // ── Sintomas: por resolver há mais de 3 dias ──
    symptoms.forEach(s => {
      if (s.resolved || !s.date) return
      const d = new Date(s.date + 'T00:00:00')
      const diffDays = Math.round((today.getTime() - d.getTime()) / DAY)
      if (diffDays < 3) return
      list.push({
        id: `symptom:${s.id}`,
        type: 'symptom',
        title: t('notif.symptomUnresolved', { defaultValue: 'Sintoma por resolver' }),
        body: `${petName(s.petId)} — ${s.description.slice(0, 60)}`,
        time: s.date,
        read: readIds.has(`symptom:${s.id}`),
        to: `pets/${s.petId}`,
      })
    })

    // ── Cuidados: pendentes hoje ──
    cares.forEach(c => {
      if (!isDueOnDate(c, todayStr)) return
      const done = c.doneByDate[todayStr]?.doneState
      if (done) return
      list.push({
        id: `care:${c.id}:${todayStr}`,
        type: 'care',
        title: t('notif.careDueToday', { defaultValue: 'Cuidado pendente hoje' }),
        body: `${petName(c.petId)} — ${c.title}`,
        time: todayStr,
        read: readIds.has(`care:${c.id}:${todayStr}`),
        to: `pets/${c.petId}`,
      })
    })

    // Mais recentes/urgentes primeiro
    return list.sort((a, b) => a.time.localeCompare(b.time))
  }, [pets, cares, vaccinesByPet, medications, symptoms, readIds, petName, t])

  const markRead = useCallback((id: string) => {
    setReadIds(prev => new Set(prev).add(id))
  }, [])

  const markAllRead = useCallback(() => {
    setReadIds(prev => {
      const next = new Set(prev)
      notifs.forEach(n => next.add(n.id))
      return next
    })
  }, [notifs])

  const dismiss = useCallback((id: string) => {
    // "Dispensar" = marcar como lida (a notificação reaparece só se a
    // condição de origem mudar, ex. data diferente para cuidados diários)
    setReadIds(prev => new Set(prev).add(id))
  }, [])

  return { notifications: notifs, markRead, markAllRead, dismiss }
}
