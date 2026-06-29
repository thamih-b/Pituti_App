import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { petsApi, symptomsApi } from '../api'
import type { ApiSymptom } from '../api'
import { useUser } from './UserContext'

export interface SymptomEntry {
  id: string
  petId: string
  description: string
  category: string
  severity: string
  date: string
  notes: string
  resolved: boolean
}

interface SymptomsContextValue {
  symptoms: SymptomEntry[]
  loading: boolean
  error: string | null
  refetch: () => void
  addSymptom: (s: Omit<SymptomEntry, 'id'>) => void
  saveSymptom: (s: SymptomEntry) => void
  resolve: (id: string) => void
  unresolve: (id: string) => void
}

const SEVERITY_MAP: Record<string, string> = {
  mild: 'leve',
  moderate: 'moderado',
  severe: 'grave',
}

function mapApiSymptom(s: ApiSymptom, petId: string): SymptomEntry {
  return {
    id: s.id,
    petId,
    description: s.description,
    category: (s as any).category ?? 'general',
    severity: SEVERITY_MAP[s.severity] ?? s.severity,
    date: s.date ?? (s as any).createdAt?.split('T')[0] ?? '',
    notes: s.notes ?? '',
    resolved: s.resolved ?? false,
  }
}

// Persistência localStorage — chave inclui userId para isolamento entre contas
function loadSymptoms(userId: string): SymptomEntry[] {
  if (!userId) return []
  try {
    return JSON.parse(localStorage.getItem(`pituti-symptoms-${userId}`) ?? 'null') ?? []
  } catch {
    return []
  }
}

function saveSymptoms(userId: string, items: any): void {
  if (!userId) return
  try {
    localStorage.setItem(`pituti-symptoms-${userId}`, JSON.stringify(items))
  } catch {
    // ignore
  }
}

const SymptomsContext = createContext<SymptomsContextValue | null>(null)

export function SymptomsProvider({ children }: { children: ReactNode }) {
  // FIX: incluir `ready` — sem ele o useEffect pode disparar com user.id='' e ler chave errada
  const { user, isAuthenticated, ready } = useUser()
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  // FIX: dep array inclui `ready`
  useEffect(() => {
    if (!ready || !isAuthenticated || !user.id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    // 1. localStorage imediato
    const stored = loadSymptoms(user.id)
    if (stored.length) setSymptoms(stored)

    // 2. API em background
    petsApi
      .getAll(user.id)
      .then(async res => {
        const pets = res.data as any[]
        const results = await Promise.all(
          pets.map(p =>
            symptomsApi
              .getAll(p.id)
              .then(r => (r.data as any[]).map(s => mapApiSymptom(s, p.id)))
              .catch(() => [] as SymptomEntry[])
          )
        )
        if (!cancelled) {
          const apiSymptoms = results.flat()
          if (apiSymptoms.length) {
            setSymptoms(apiSymptoms)
            saveSymptoms(user.id, apiSymptoms)
          }
        }
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? 'Erro ao carregar sintomas')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [ready, isAuthenticated, user.id, tick])

  const addSymptom = useCallback(
    async (s: Omit<SymptomEntry, 'id'>) => {
      const local = { ...s, id: `s-${Date.now()}` }
      setSymptoms(prev => {
        const next = [...prev, local]
        if (user.id) saveSymptoms(user.id, next)
        return next
      })
      symptomsApi
        .create(s.petId, {
          description: s.description,
          severity: s.severity as any,
          date: s.date,
          notes: s.notes || undefined,
          resolved: s.resolved as any,
        })
        .catch(() => {
          // silencia
        })
    },
    [user.id]
  )

  const saveSymptom = useCallback((updated: SymptomEntry) => {
    setSymptoms(prev => prev.map(s => (s.id === updated.id ? updated : s)))
  }, [])

  const resolve = useCallback(
    async (id: string) => {
      const s = symptoms.find(x => x.id === id)
      if (s) {
        try {
          await symptomsApi.update(s.petId, id, { resolved: true } as any)
        } catch {
          // silencia
        }
      }
      setSymptoms(prev => {
        const next = prev.map(x => (x.id === id ? { ...x, resolved: true } : x))
        if (user.id) saveSymptoms(user.id, next)
        return next
      })
    },
    [symptoms, user.id]
  )

  const unresolve = useCallback(
    async (id: string) => {
      const s = symptoms.find(x => x.id === id)
      if (s) {
        try {
          await symptomsApi.update(s.petId, id, { resolved: false } as any)
        } catch {
          // silencia
        }
      }
      setSymptoms(prev => {
        const next = prev.map(x => (x.id === id ? { ...x, resolved: false } : x))
        if (user.id) saveSymptoms(user.id, next)
        return next
      })
    },
    [symptoms, user.id]
  )

  return (
    <SymptomsContext.Provider
      value={{ symptoms, loading, error, refetch, addSymptom, saveSymptom, resolve, unresolve }}
    >
      {children}
    </SymptomsContext.Provider>
  )
}

export function useSymptoms() {
  const ctx = useContext(SymptomsContext)
  if (!ctx) throw new Error('useSymptoms must be used within SymptomsProvider')
  return ctx
}

export function usePetSymptoms(petId: string) {
  const { symptoms } = useSymptoms()
  return {
    active: symptoms.filter(s => s.petId === petId && !s.resolved),
    resolved: symptoms.filter(s => s.petId === petId && s.resolved),
    all: symptoms.filter(s => s.petId === petId),
  }
}
