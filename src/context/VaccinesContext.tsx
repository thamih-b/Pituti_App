import {
  createContext, useContext, useState, useCallback, useEffect, type ReactNode,
} from 'react'
import { usePetsContext } from './PetsContext'
import { useUser } from './UserContext'
import { getVaccStatus } from '../utils/vaccUtils'
import type { VaccineRecord } from '../utils/vaccUtils'
import { vaccinesApi } from '../api'

export type VaccStatus = ReturnType<typeof getVaccStatus>

export interface VaccineWithMeta extends VaccineRecord {
  cls:      VaccStatus
  petName:  string
  petEmoji: string
  petId:    string
}

// Novo tipo de entrada para addVaccine — datas ISO brutas
export interface AddVaccineInput {
  name:     string
  date:     string    // ISO YYYY-MM-DD — data de aplicação
  nextDate: string    // ISO YYYY-MM-DD — próxima dose ('' se não definida)
  vet?:     string
  notes?:   string
}

const PET_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🐦', rabbit: '🐰',
  reptile: '🦎', fish: '🐠', other: '🐾',
}

const BADGE_MAP: Record<VaccStatus, { badge: string; badgeCls: string }> = {
  ok:   { badge: 'Em dia',         badgeCls: 'badge-green'  },
  soon: { badge: 'Vence em breve', badgeCls: 'badge-yellow' },
  late: { badge: 'Expirada',       badgeCls: 'badge-red'    },
}

function loadVaccines(key: string): VaccineRecord[] {
  try { return JSON.parse(localStorage.getItem(`pituti-vaccines-${key}`) ?? 'null') ?? [] }
  catch { return [] }
}

function saveVaccines(key: string, items: VaccineRecord[]): void {
  try { localStorage.setItem(`pituti-vaccines-${key}`, JSON.stringify(items)) }
  catch { /* ignore */ }
}

// ─── toVaccineRecord ──────────────────────────────────────────────────────────
// Converte o que vem da API (já mapeado por mapApiVaccine) para VaccineRecord.
//
// FIX BUG 2: mapApiVaccine retorna { nextDueDate, date } (camelCase).
// O original lia api.nextDate/api.nextdate que nunca existiam → nextDate: ''
function toVaccineRecord(api: Record<string, unknown>): VaccineRecord {
  const nextDate = String(
    api.nextDueDate   ??   // ← campo real de mapApiVaccine
    api.nextdue       ??
    api.nextDate      ??
    api.nextdate      ??
    api.next_due_date ??
    ''
  )

  const name = String(api.vaccinename ?? api.name ?? '')

  // 'date' é o campo de mapApiVaccine; 'applied' é fallback de VaccineRecord já formatado
  const rawDate = String(api.date ?? api.dateapplied ?? api.applied ?? api.vaccine_date ?? '')

  const cls = getVaccStatus(nextDate) as VaccStatus

  return {
    id:   String(api.id ?? ''),
    name,
    applied: rawDate
      ? (() => {
          try {
            return new Date(rawDate.includes('T') ? rawDate : rawDate + 'T12:00:00')
              .toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
          } catch { return rawDate }
        })()
      : '',
    nextDate,
    badge:    BADGE_MAP[cls].badge,
    badgeCls: BADGE_MAP[cls].badgeCls,
  }
}

// ─── Context interface ────────────────────────────────────────────────────────

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
  const { pets }        = usePetsContext()
  const { user, ready } = useUser()

  const [vaccinesByPet, setVaccinesByPet] = useState<Record<string, VaccineRecord[]>>({})
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  // Carrega localStorage imediatamente (evita flash vazio enquanto API responde)
  useEffect(() => {
    if (!ready || !user.id || !pets.length) return
    const fromStorage: Record<string, VaccineRecord[]> = {}
    for (const p of pets) {
      const stored = loadVaccines(p.id)
      if (stored.length) fromStorage[p.id] = stored
    }
    if (Object.keys(fromStorage).length > 0) setVaccinesByPet(fromStorage)
  }, [ready, user.id, pets])

  const load = useCallback(() => {
    if (!pets.length) { setLoading(false); return }
    setLoading(true)
    setError(null)

    Promise.all(
      pets.map(p =>
        vaccinesApi
          .getAll(p.id)
          .then(r => ({
            petId:   p.id,
            data:    (r.data as unknown[]).map(raw => toVaccineRecord(raw as Record<string, unknown>)),
            fromApi: true as const,
          }))
          // FIX BUG 1: quando a API falha, usa o cache do localStorage em vez de []
          // O original retornava data:[] → setVaccinesByPet apagava o cache → vacinas sumiam
          .catch(() => ({
            petId:   p.id,
            data:    loadVaccines(p.id),
            fromApi: false as const,
          }))
      )
    )
      .then(results => {
        const map: Record<string, VaccineRecord[]> = {}
        results.forEach(r => {
          map[r.petId] = r.data
          // Só persiste no localStorage quando veio da API (dados frescos)
          if (r.fromApi && r.data.length) saveVaccines(r.petId, r.data)
        })
        setVaccinesByPet(map)
      })
      .catch(err => setError(err?.message ?? 'Erro ao carregar vacinas'))
      .finally(() => setLoading(false))
  }, [pets])

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

  // ─── addVaccine ─────────────────────────────────────────────────────────────
  // FIX BUG 3: o original recebia um VaccineRecord e chamava vaccinesApi.create(petId, data)
  // onde data.date era undefined (VaccineRecord tem 'applied', não 'date') e
  // data.nextDueDate era undefined (VaccineRecord tem 'nextDate') →
  // toApiCreateVaccineDto produzia { date: undefined, next_due_date: undefined } →
  // Zod rejeitava com 400 → vacina nunca era gravada no servidor.
  //
  // Agora recebe AddVaccineInput com as datas ISO brutas do formulário e
  // monta tanto o VaccineRecord (para exibição local) como o CreateVaccineDto
  // (para a API) correctamente.
  const addVaccine = useCallback(async (petId: string, input: AddVaccineInput) => {
    const cls = getVaccStatus(input.nextDate) as VaccStatus
    const applied = input.date
      ? (() => {
          try {
            return new Date(input.date + 'T12:00:00')
              .toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
          } catch { return input.date }
        })()
      : ''

    const tempId = `v-${Date.now()}`
    const local: VaccineRecord = {
      id:       tempId,
      name:     input.name,
      applied,
      nextDate: input.nextDate,
      badge:    BADGE_MAP[cls].badge,
      badgeCls: BADGE_MAP[cls].badgeCls,
    }

    // 1. Optimistic update imediato
    setVaccinesByPet(prev => {
      const next = [...(prev[petId] ?? []), local]
      saveVaccines(petId, next)
      return { ...prev, [petId]: next }
    })

    // 2. Persiste no servidor com os tipos correctos
    try {
      const res = await vaccinesApi.create(petId, {
        name:        input.name,
        date:        input.date,           // ISO → toApiCreateVaccineDto envia como 'date'
        nextDueDate: input.nextDate || null, // ISO → envia como 'next_due_date'
        veterinary:  input.vet   || null,
        notes:       input.notes || null,
      })

      // 3. Substitui ID temporário pelo UUID real do servidor
      const fromApi = toVaccineRecord(res.data as unknown as Record<string, unknown>)
      if (fromApi.id && fromApi.id !== tempId) {
        setVaccinesByPet(prev => {
          const updated = (prev[petId] ?? []).map(v => v.id === tempId ? fromApi : v)
          saveVaccines(petId, updated)
          return { ...prev, [petId]: updated }
        })
      }
    } catch (err) {
      // Falha silenciosa — optimistic update permanece (vacina visível localmente)
      console.warn('[VaccinesContext] addVaccine API error:', err)
    }
  }, [])

  const deleteVaccine = useCallback(async (petId: string, vaccineId: string) => {
    // Não tenta deletar IDs temporários no servidor
    if (!vaccineId.startsWith('v-')) {
      await vaccinesApi.delete(petId, vaccineId)
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
