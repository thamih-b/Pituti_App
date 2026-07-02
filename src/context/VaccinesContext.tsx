import {
  createContext, useContext, useState, useCallback, useEffect, type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { usePetsContext } from './PetsContext'
import { useUser } from './UserContext'
import { getVaccStatus } from '../utils/vaccUtils'
import type { VaccineRecord } from '../utils/vaccUtils'
import vaccinesApi from '../api/vaccines'

export type VaccStatus = ReturnType<typeof getVaccStatus>

export interface VaccineWithMeta extends VaccineRecord {
  cls:      VaccStatus
  petName:  string
  petEmoji: string
  petId:    string
}

// Dados de entrada para addVaccine — datas ISO brutas (não formatadas)
export interface AddVaccineInput {
  name:     string
  date:     string   // ISO YYYY-MM-DD — data de aplicação
  nextDate: string   // ISO YYYY-MM-DD — próxima dose ('' se não definida)
  vet?:     string
  notes?:   string
}

const PET_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🐦', rabbit: '🐰',
  reptile: '🦎', fish: '🐠', other: '🐾',
}

// ── localStorage helpers ──────────────────────────────────────────────────────

const cacheKey = (petId: string) => `pituti-vaccines-${petId}`

function loadVaccines(petId: string): VaccineRecord[] {
  try { return JSON.parse(localStorage.getItem(cacheKey(petId)) ?? 'null') ?? [] }
  catch { return [] }
}

function saveVaccines(petId: string, items: VaccineRecord[]): void {
  try { localStorage.setItem(cacheKey(petId), JSON.stringify(items)) }
  catch { /* quota */ }
}

// ── Converte ApiVaccine → VaccineRecord para exibição ────────────────────────
// A API (via mapApiVaccine) já retorna { date, nextDueDate } em camelCase.
function toVaccineRecord(
  api: Record<string, unknown>,
  badgeLabel:  (cls: VaccStatus) => string,
  badgeCls:    (cls: VaccStatus) => string,
): VaccineRecord {
  // nextDate: field retornado por mapApiVaccine
  const nextDate = String(
    api.nextDueDate    ??
    api.nextDate       ??
    api.next_due_date  ??
    api.next_dose_date ??
    ''
  )

  // rawDate: field retornado por mapApiVaccine
  const rawDate = String(
    api.date         ??
    api.vaccine_date ??
    api.applied      ??
    ''
  )

  const applied = rawDate
    ? (() => {
        try {
          return new Date(rawDate.includes('T') ? rawDate : `${rawDate}T12:00:00`)
            .toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        } catch { return rawDate }
      })()
    : ''

  const cls = getVaccStatus(nextDate) as VaccStatus

  return {
    id:       String(api.id   ?? ''),
    name:     String(api.name ?? ''),
    applied,
    nextDate,
    badge:    badgeLabel(cls),
    badgeCls: badgeCls(cls),
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface VaccinesContextValue {
  vaccinesByPet: Record<string, VaccineRecord[]>
  allVaccines:   VaccineWithMeta[]
  loading:       boolean
  error:         string | null
  addVaccine:    (petId: string, input: AddVaccineInput) => Promise<void>
  updateVaccine: (petId: string, v: VaccineRecord) => void
  deleteVaccine: (petId: string, vaccineId: string) => Promise<void>
  refetch:       () => void
}

const VaccinesContext = createContext<VaccinesContextValue | null>(null)

export function VaccinesProvider({ children }: { children: ReactNode }) {
  const { t }           = useTranslation()
  const { pets }        = usePetsContext()
  const { user, ready } = useUser()

  const [vaccinesByPet, setVaccinesByPet] = useState<Record<string, VaccineRecord[]>>({})
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  // Helpers de badge com i18n correcta
  const getBadgeLabel = useCallback((cls: VaccStatus): string => {
    const map: Record<VaccStatus, string> = {
      ok:   t('pet.vacc.badgeOk',   { defaultValue: 'Em dia'         }),
      soon: t('pet.vacc.badgeSoon', { defaultValue: 'Vence em breve' }),
      late: t('pet.vacc.badgeLate', { defaultValue: 'Expirada'       }),
    }
    return map[cls]
  }, [t])

  const getBadgeCls = (cls: VaccStatus): string => ({
    ok:   'badge-green',
    soon: 'badge-yellow',
    late: 'badge-red',
  }[cls])

  // ── Carrega cache do localStorage na montagem (evita flash vazio) ──────────
  useEffect(() => {
    if (!ready || !user.id || !pets.length) return
    const fromStorage: Record<string, VaccineRecord[]> = {}
    for (const p of pets) {
      const stored = loadVaccines(p.id)
      if (stored.length) fromStorage[p.id] = stored
    }
    if (Object.keys(fromStorage).length > 0) setVaccinesByPet(fromStorage)
  }, [ready, user.id, pets])

  // ── Fetch do servidor ─────────────────────────────────────────────────────
  const load = useCallback(() => {
    if (!pets.length) { setLoading(false); return }
    setLoading(true)
    setError(null)

    Promise.all(
      pets.map(p =>
        vaccinesApi.getAll(p.id)
          .then(r => ({
            petId: p.id,
            // vaccinesApi.getAll já aplica mapApiVaccine a cada item
            data: (r.data as unknown[]).map(raw =>
              toVaccineRecord(
                raw as Record<string, unknown>,
                getBadgeLabel,
                getBadgeCls,
              )
            ),
          }))
          .catch(() => ({ petId: p.id, data: [] as VaccineRecord[] }))
      )
    )
      .then(results => {
        const map: Record<string, VaccineRecord[]> = {}
        results.forEach(r => {
          map[r.petId] = r.data
          if (r.data.length) saveVaccines(r.petId, r.data)
        })
        setVaccinesByPet(map)
      })
      .catch(err => setError(err?.message ?? 'Erro ao carregar vacinas'))
      .finally(() => setLoading(false))
  }, [pets, getBadgeLabel])

  useEffect(() => {
    if (ready && pets.length > 0) load()
  }, [load, ready])

  const allVaccines: VaccineWithMeta[] = pets.flatMap(p =>
    (vaccinesByPet[p.id] ?? []).map(v => ({
      ...v,
      cls:      getVaccStatus(v.nextDate) as VaccStatus,
      petName:  p.name,
      petEmoji: PET_EMOJI[p.species] ?? '🐾',
      petId:    p.id,
    }))
  )

  // ── addVaccine: recebe datas ISO brutas e envia correctamente à API ────────
  const addVaccine = useCallback(async (petId: string, input: AddVaccineInput) => {
    const cls = getVaccStatus(input.nextDate) as VaccStatus

    // Formata para exibição (optimistic update)
    const applied = input.date
      ? (() => {
          try {
            return new Date(`${input.date}T12:00:00`)
              .toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
          } catch { return input.date }
        })()
      : ''

    const tempId = `v-tmp-${Date.now()}`
    const tempRec: VaccineRecord = {
      id:       tempId,
      name:     input.name,
      applied,
      nextDate: input.nextDate,
      badge:    getBadgeLabel(cls),
      badgeCls: getBadgeCls(cls),
    }

    // 1. Optimistic update imediato
    setVaccinesByPet(prev => {
      const next = [...(prev[petId] ?? []), tempRec]
      saveVaccines(petId, next)
      return { ...prev, [petId]: next }
    })

    // 2. Persiste no servidor
    // vaccinesApi.create chama toApiCreateVaccineDto que envia { date, next_due_date }
    try {
      const res = await vaccinesApi.create(petId, {
        name:        input.name,
        date:        input.date,     // ISO → toApiCreateVaccineDto envia como 'date'
        nextDueDate: input.nextDate || null, // ISO → envia como 'next_due_date'
        veterinary:  input.vet   || null,
        notes:       input.notes || null,
      })

      // vaccinesApi.create já aplica mapApiVaccine ao res.data
      const fromApi = toVaccineRecord(
        res.data as unknown as Record<string, unknown>,
        getBadgeLabel,
        getBadgeCls,
      )
      const realId = fromApi.id || tempId

      // 3. Substitui ID temporário pelo UUID real
      setVaccinesByPet(prev => {
        const updated = (prev[petId] ?? []).map(v =>
          v.id === tempId ? { ...fromApi, id: realId } : v
        )
        saveVaccines(petId, updated)
        return { ...prev, [petId]: updated }
      })
    } catch (err) {
      console.warn('[VaccinesContext] addVaccine API error:', err)
      // Mantém o optimistic update — vacina visível localmente
    }
  }, [getBadgeLabel])

  const deleteVaccine = useCallback(async (petId: string, vaccineId: string) => {
    if (!vaccineId.startsWith('v-tmp-')) {
      try { await vaccinesApi.delete(petId, vaccineId) } catch { /* ignore */ }
    }
    setVaccinesByPet(prev => {
      const next = { ...prev, [petId]: (prev[petId] ?? []).filter(v => v.id !== vaccineId) }
      saveVaccines(petId, next[petId])
      return next
    })
  }, [])

  const updateVaccine = useCallback((petId: string, v: VaccineRecord) => {
    setVaccinesByPet(prev => {
      const updated = (prev[petId] ?? []).map(x => (x.id === v.id ? v : x))
      saveVaccines(petId, updated)
      return { ...prev, [petId]: updated }
    })
  }, [])

  return (
    <VaccinesContext.Provider value={{
      vaccinesByPet, allVaccines, loading, error,
      addVaccine, updateVaccine, deleteVaccine, refetch: load,
    }}>
      {children}
    </VaccinesContext.Provider>
  )
}

export function useVaccinesContext() {
  const ctx = useContext(VaccinesContext)
  if (!ctx) throw new Error('useVaccinesContext must be inside VaccinesProvider')
  return ctx
}
