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

export type VaccStatus = 'ok' | 'soon' | 'late'

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
  ok:   { badge: 'Em dia',       badgeCls: 'badge-green'  },
  soon: { badge: 'Vence em breve', badgeCls: 'badge-yellow' },
  late: { badge: 'Expirada',     badgeCls: 'badge-red'    },
}

// Persistência — chave por pet (compatibilidade com código existente)
function loadVaccines(key: string): VaccineRecord[] {
  try {
    return JSON.parse(localStorage.getItem(`pituti-vaccines-${key}`) ?? 'null') ?? []
  } catch {
    return []
  }
}

function saveVaccines(key: string, items: any): void {
  try {
    localStorage.setItem(`pituti-vaccines-${key}`, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function toVaccineRecord(api: Record<string, unknown>): VaccineRecord {
  const nextDate = String(api.nextdue ?? api.nextDate ?? api.nextdate ?? '')
  const name = String(api.vaccinename ?? api.name ?? '')
  const applied = String(api.dateapplied ?? api.applied ?? api.date ?? '')
  const cls = getVaccStatus(nextDate) as VaccStatus
  return {
    id: String(api.id ?? ''),
    name,
    applied: applied
      ? new Date(applied + 'T12:00:00').toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '',
    nextDate,
    badge: BADGE_MAP[cls].badge,
    badgeCls: BADGE_MAP[cls].badgeCls,
  }
}

interface VaccinesContextValue {
  vaccinesByPet: Record<string, VaccineRecord[]>
  allVaccines: VaccineWithMeta[]
  loading: boolean
  error: string | null
  addVaccine: (petId: string, v: VaccineRecord) => void
  updateVaccine: (petId: string, v: VaccineRecord) => void
  deleteVaccine: (petId: string, vaccineId: string) => Promise<void>
  refetch: () => void
}

const VaccinesContext = createContext<VaccinesContextValue | null>(null)

export function VaccinesProvider({ children }: { children: ReactNode }) {
  const { pets } = usePetsContext()
  // FIX: incluir `ready` para sincronizar com o ciclo de leitura do UserContext
  const { user, ready } = useUser()
  const [vaccinesByPet, setVaccinesByPet] = useState<Record<string, VaccineRecord[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // FIX: ao recarregar, ler localStorage para cada pet IMEDIATAMENTE antes da API
  useEffect(() => {
    if (!ready || !user.id) return

    // Carregar do localStorage para todos os pets conhecidos (persistência imediata)
    if (pets.length > 0) {
      const fromStorage: Record<string, VaccineRecord[]> = {}
      for (const p of pets) {
        const stored = loadVaccines(p.id)
        if (stored.length) fromStorage[p.id] = stored
      }
      if (Object.keys(fromStorage).length > 0) {
        setVaccinesByPet(fromStorage)
      }
    }
  }, [ready, user.id, pets])

  const load = useCallback(() => {
    if (!pets.length) {
      setLoading(false)
      return
    }
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
          // FIX: persistir resultados da API no localStorage por pet
          if (r.data.length) saveVaccines(r.petId, r.data)
        })
        setVaccinesByPet(map)
      })
      .catch(err => setError(err?.message ?? 'Erro ao carregar vacinas'))
      .finally(() => setLoading(false))
  }, [pets])

  // FIX: disparar load quando pets estiverem disponíveis e UserContext estiver pronto
  useEffect(() => {
    if (ready && pets.length > 0) {
      load()
    }
  }, [load, ready])

  const allVaccines: VaccineWithMeta[] = pets.flatMap(p =>
    (vaccinesByPet[p.id] ?? []).map(v => ({
      ...v,
      cls: getVaccStatus(v.nextDate) as VaccStatus,
      petName: p.name,
      petEmoji: PET_EMOJI[p.species] ?? '🐾',
      petId: p.id,
    }))
  )

  const addVaccine = useCallback(async (petId: string, data: any) => {
    const local = { ...data, id: `v-${Date.now()}` } as VaccineRecord
    setVaccinesByPet(prev => {
      const nextForPet = [...(prev[petId] ?? []), local]
      try { saveVaccines(petId, nextForPet) } catch { /* ignore */ }
      return { ...prev, [petId]: nextForPet }
    })
    vaccinesApi.create(petId, data).catch(() => {
      // silencia
    })
  }, [])

  const deleteVaccine = useCallback(async (petId: string, vaccineId: string) => {
    await vaccinesApi.delete(petId, vaccineId)
    setVaccinesByPet(prev => {
      const next = { ...prev, [petId]: (prev[petId] ?? []).filter(v => v.id !== vaccineId) }
      try { saveVaccines(petId, next[petId]) } catch { /* ignore */ }
      return next
    })
  }, [])

  const updateVaccine = useCallback((petId: string, v: VaccineRecord) => {
    setVaccinesByPet(prev => {
      const updated = (prev[petId] ?? []).map(x => (x.id === v.id ? v : x))
      try { saveVaccines(petId, updated) } catch { /* ignore */ }
      return { ...prev, [petId]: updated }
    })
  }, [])

  return (
    <VaccinesContext.Provider
      value={{
        vaccinesByPet,
        allVaccines,
        loading,
        error,
        addVaccine,
        updateVaccine,
        deleteVaccine,
        refetch: load,
      }}
    >
      {children}
    </VaccinesContext.Provider>
  )
}

export function useVaccinesContext() {
  const ctx = useContext(VaccinesContext)
  if (!ctx) throw new Error('useVaccinesContext must be inside VaccinesProvider')
  return ctx
}
