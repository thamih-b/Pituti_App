import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { usePetsContext } from './PetsContext'
import { useUser } from './UserContext'
import { getVaccStatus } from '../utils/vaccUtils'
import type { VaccineRecord } from '../utils/vaccUtils'
import { vaccinesApi } from '../api'

export type VaccStatus = ReturnType<typeof getVaccStatus>

export interface VaccineWithMeta extends VaccineRecord {
  cls: VaccStatus
  petName: string
  petEmoji: string
  petId: string
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

// FIX: mapeamento correcto dos campos da API para VaccineRecord
// A API retorna: { id, petId, name, date, nextDueDate, veterinary, notes, createdAt }
// O campo anterior era 'applied' mas a API agora devolve 'date'
// O campo anterior era 'nextDate' mas a API devolve 'nextDueDate'
function toVaccineRecord(api: Record<string, unknown>): VaccineRecord {
  // nextDate: suporta todos os nomes possíveis (antigo e novo schema)
  const nextDate = String(
    api.nextDueDate  ??  // FIX: novo nome correcto (camelCase da API)
    api.nextdue      ??
    api.nextDate     ??  // nome antigo
    api.nextdate     ??
    api.next_due_date ??
    ''
  )

  const name = String(api.vaccinename ?? api.name ?? '')

  // applied: data de aplicação (também tem variações de nome)
  const appliedRaw = String(
    api.date         ??  // FIX: novo nome correcto da API
    api.dateapplied  ??
    api.applied      ??
    api.vaccine_date ??
    ''
  )

  const cls = getVaccStatus(nextDate) as VaccStatus

  return {
    id:       String(api.id ?? ''),
    name,
    applied:  appliedRaw
      ? new Date(appliedRaw + (appliedRaw.includes('T') ? '' : 'T12:00:00'))
          .toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    nextDate,
    badge:    BADGE_MAP[cls].badge,
    badgeCls: BADGE_MAP[cls].badgeCls,
  }
}

interface VaccinesContextValue {
  vaccinesByPet: Record<string, VaccineRecord[]>
  allVaccines: VaccineWithMeta[]
  loading: boolean
  error: string | null
  addVaccine: (petId: string, v: VaccineRecord) => Promise<void>
  updateVaccine: (petId: string, v: VaccineRecord) => void
  deleteVaccine: (petId: string, vaccineId: string) => Promise<void>
  refetch: () => void
}

const VaccinesContext = createContext<VaccinesContextValue | null>(null)

export function VaccinesProvider({ children }: { children: ReactNode }) {
  const { pets }         = usePetsContext()
  const { user, ready }  = useUser()
  const [vaccinesByPet, setVaccinesByPet] = useState<Record<string, VaccineRecord[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  // Carrega do localStorage imediatamente para evitar flash vazio
  useEffect(() => {
    if (!ready || !user.id || !pets.length) return
    const fromStorage: Record<string, VaccineRecord[]> = {}
    for (const p of pets) {
      const stored = loadVaccines(p.id)
      if (stored.length) fromStorage[p.id] = stored
    }
    if (Object.keys(fromStorage).length > 0) {
      setVaccinesByPet(fromStorage)
    }
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
            petId: p.id,
            data: (r.data as unknown[]).map(raw =>
              toVaccineRecord(raw as Record<string, unknown>)
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

  // FIX: addVaccine agora aguarda a resposta do servidor para usar o ID real
  const addVaccine = useCallback(async (petId: string, data: VaccineRecord) => {
    // 1. Optimistic update com ID temporário
    const tempId  = `v-tmp-${Date.now()}`
    const tempRec = { ...data, id: tempId }

    setVaccinesByPet(prev => {
      const next = [...(prev[petId] ?? []), tempRec]
      saveVaccines(petId, next)
      return { ...prev, [petId]: next }
    })

    // 2. Cria no servidor
    try {
      const res     = await vaccinesApi.create(petId, data)
      const fromApi = toVaccineRecord(res.data as unknown as Record<string, unknown>)
      const realId  = fromApi.id || tempId

      // 3. Substitui o ID temporário pelo ID real do servidor
      setVaccinesByPet(prev => {
        const updated = (prev[petId] ?? []).map(v =>
          v.id === tempId ? { ...fromApi, id: realId } : v
        )
        saveVaccines(petId, updated)
        return { ...prev, [petId]: updated }
      })
    } catch {
      // Falha silenciosa — vacina continua visível com ID temporário
    }
  }, [])

  const deleteVaccine = useCallback(async (petId: string, vaccineId: string) => {
    // Não tenta deletar IDs temporários no servidor
    if (!vaccineId.startsWith('v-tmp-')) {
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
