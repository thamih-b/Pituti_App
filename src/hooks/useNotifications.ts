// src/hooks/useNotifications.ts — NOVO FICHEIRO
//
// Calcula notificações reais a partir dos dados já sincronizados (cuidados,
// vacinas, medicamentos, sintomas). Antes disto, o painel de notificações
// (NotificationPanel.tsx) tinha toda a interface pronta, mas `notifs`
// começava sempre vazio e nunca era preenchido.

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

const READ_KEY      = 'pituti-notif-read'
const DISMISSED_KEY = 'pituti-notif-dismissed'

function loadIds(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')) }
  catch { return new Set() }
}
function persistIds(key: string, ids: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...ids])) } catch {}
}

const DAY = 86_400_000

export function useNotifications() {
  const { t } = useTranslation()
  const { pets } = usePetsContext()
  const { items: cares } = useCares()
  const { vaccinesByPet } = useVaccinesContext()
  const { medications } = useMedications()
  const { symptoms } = useSymptoms()

  const [readIds, setReadIds] = useState<Set<string>>(() => loadIds(READ_KEY))
  useEffect(() => { persistIds(READ_KEY, readIds) }, [readIds])

  // FIX: "dispensar" (✕) precisa de REMOVER a notificação do painel — antes
  // usava o mesmo conjunto de "lidas", por isso a notificação continuava
  // visível (só menos destacada) depois de se clicar no ✕.
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => loadIds(DISMISSED_KEY))
  useEffect(() => { persistIds(DISMISSED_KEY, dismissedIds) }, [dismissedIds])

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
    // FIX: id inclui o nível de urgência (soon/late) — dispensar o aviso
    // "a vencer" não deve esconder o aviso "atrasada" quando a data passar,
    // porque são ids diferentes.
    Object.entries(vaccinesByPet).forEach(([petId, vaccines]) => vaccines.forEach(v => {
      if (!v.nextDate) return
      const next = new Date(v.nextDate + 'T00:00:00')
      const diffDays = Math.round((next.getTime() - today.getTime()) / DAY)
      if (diffDays > 7) return
      const late = diffDays < 0
      const id = `vaccine:${v.id}:${late ? 'late' : 'soon'}`
      list.push({
        id,
        type: 'vaccine',
        title: late ? t('notif.vaccineLate', { defaultValue: 'Vacina atrasada' })
                     : t('notif.vaccineSoon', { defaultValue: 'Vacina a vencer' }),
        body: `${petName(petId)} — ${v.name}`,
        time: v.nextDate,
        read: readIds.has(id),
        to: `pets/${petId}`,
      })
    }))

    // ── Medicamentos: a terminar nos próximos 3 dias ──
    medications.forEach(m => {
      if (m.archived || !m.endDate) return
      const end = new Date(m.endDate + 'T00:00:00')
      const diffDays = Math.round((end.getTime() - today.getTime()) / DAY)
      if (diffDays < 0 || diffDays > 3) return
      const id = `medication:${m.id}`
      list.push({
        id,
        type: 'medication',
        title: t('notif.medEnding', { defaultValue: 'Medicamento a terminar' }),
        body: `${petName(m.petId)} — ${m.title}`,
        time: m.endDate,
        read: readIds.has(id),
        to: `pets/${m.petId}`,
      })
    })

    // ── Sintomas: por resolver há mais de 3 dias ──
    symptoms.forEach(s => {
      if (s.resolved || !s.date) return
      const d = new Date(s.date + 'T00:00:00')
      const diffDays = Math.round((today.getTime() - d.getTime()) / DAY)
      if (diffDays < 3) return
      const id = `symptom:${s.id}`
      list.push({
        id,
        type: 'symptom',
        title: t('notif.symptomUnresolved', { defaultValue: 'Sintoma por resolver' }),
        body: `${petName(s.petId)} — ${s.description.slice(0, 60)}`,
        time: s.date,
        read: readIds.has(id),
        to: `pets/${s.petId}`,
      })
    })

    // ── Cuidados: pendentes hoje ──
    // (id inclui a data de hoje — dispensar não afeta o dia seguinte)
    cares.forEach(c => {
      if (!isDueOnDate(c, todayStr)) return
      const done = c.doneByDate[todayStr]?.doneState
      if (done) return
      const id = `care:${c.id}:${todayStr}`
      list.push({
        id,
        type: 'care',
        title: t('notif.careDueToday', { defaultValue: 'Cuidado pendente hoje' }),
        body: `${petName(c.petId)} — ${c.title}`,
        time: todayStr,
        read: readIds.has(id),
        to: `pets/${c.petId}`,
      })
    })

    // FIX: filtra as dispensadas — é isto que faz o ✕ removê-las de facto
    // do painel, em vez de as deixar visíveis só marcadas como lidas.
    return list
      .filter(n => !dismissedIds.has(n.id))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [pets, cares, vaccinesByPet, medications, symptoms, readIds, dismissedIds, petName, t])

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

  // FIX: dismiss agora remove mesmo a notificação (ver filtro acima),
  // em vez de só a marcar como lida.
  const dismiss = useCallback((id: string) => {
    setDismissedIds(prev => new Set(prev).add(id))
  }, [])

  return { notifications: notifs, markRead, markAllRead, dismiss }
}
