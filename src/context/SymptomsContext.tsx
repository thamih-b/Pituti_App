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

const SEVERITY_MAP: Record<string, string> = { mild: 'leve', moderate: 'moderado', severe: 'grave' }
// FIX (sync): inverso de SEVERITY_MAP — garante que enviamos sempre o valor
// em inglês que a API espera (mild/moderate/severe), mesmo que o valor local
// já esteja traduzido para português.
const SEVERITY_TO_API: Record<string, string> = {
  leve: 'mild', moderado: 'moderate', grave: 'severe',
  mild: 'mild', moderate: 'moderate', severe: 'severe',
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

function loadSymptoms(userId: string): SymptomEntry[] {
  if (!userId) return []
  try { return JSON.parse(localStorage.getItem(`pituti-symptoms-${userId}`) ?? 'null') ?? [] }
  catch { return [] }
}

function saveSymptoms(userId: string, items: any): void {
  if (!userId) return
  try { localStorage.setItem(`pituti-symptoms-${userId}`, JSON.stringify(items)) }
  catch { /* ignore */ }
}

const SymptomsContext = createContext<SymptomsContextValue | null>(null)

export function SymptomsProvider({ children }: { children: ReactNode }) {
  // FIX: `ready` garante que user.id tem valor real antes de ler localStorage
  const { user, isAuthenticated, ready } = useUser()
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    if (!ready || !isAuthenticated || !user.id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    // FIX (sync): antes líamos o localStorage primeiro e só substituíamos
    // pelo resultado da API "se não viesse vazio" — isso escondia falhas
    // reais da API (o aparelho continuava a mostrar só o que tinha gravado
    // localmente) e é exactamente o que fazia sintomas parecerem persistir
    // "só localmente". Agora a API é a única fonte de verdade, tal como em
    // Pets/Cares.
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
          const api = results.flat()
          setSymptoms(api)
          saveSymptoms(user.id, api) // apenas cache local, não fonte de verdade
        }
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Erro ao carregar sintomas') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [ready, isAuthenticated, user.id, tick])

  const addSymptom = useCallback(async (s: Omit<SymptomEntry, 'id'>) => {
    const local = { ...s, id: `s-${Date.now()}` }
    setSymptoms(prev => { const next = [...prev, local]; if (user.id) saveSymptoms(user.id, next); return next })
    // FIX: severidade sempre convertida para o valor em inglês esperado pela API
    symptomsApi.create(s.petId, {
      description: s.description,
      severity: (SEVERITY_TO_API[s.severity] ?? s.severity) as any,
      date: s.date,
      notes: s.notes || undefined,
      resolved: s.resolved as any,
    }).catch(() => {})
  }, [user.id])

  // FIX (sync): saveSymptom nunca chamava a API — só alterava o estado local
  // (e nem sequer gravava em localStorage). Editar um sintoma nunca chegava
  // a ser persistido, por isso desaparecia ao mudar de aparelho / atualizar.
  const saveSymptom = useCallback((updated: SymptomEntry) => {
    setSymptoms(prev => {
      const next = prev.map(s => (s.id === updated.id ? updated : s))
      if (user.id) saveSymptoms(user.id, next)
      return next
    })

    if (updated.id.startsWith('s-')) return // ID temporário, ainda sem correspondência no servidor

    symptomsApi
      .update(updated.petId, updated.id, {
        description: updated.description,
        severity: (SEVERITY_TO_API[updated.severity] ?? updated.severity) as any,
        date: updated.date,
        notes: updated.notes || undefined,
        resolved: updated.resolved as any,
      })
      .catch(err => console.warn('[SymptomsContext] saveSymptom API error:', err))
  }, [user.id])

  const resolve = useCallback(async (id: string) => {
    const s = symptoms.find(x => x.id === id)
    if (s) { try { await symptomsApi.update(s.petId, id, { resolved: true } as any) } catch {} }
    setSymptoms(prev => { const next = prev.map(x => (x.id === id ? { ...x, resolved: true } : x)); if (user.id) saveSymptoms(user.id, next); return next })
  }, [symptoms, user.id])

  const unresolve = useCallback(async (id: string) => {
    const s = symptoms.find(x => x.id === id)
    if (s) { try { await symptomsApi.update(s.petId, id, { resolved: false } as any) } catch {} }
    setSymptoms(prev => { const next = prev.map(x => (x.id === id ? { ...x, resolved: false } : x)); if (user.id) saveSymptoms(user.id, next); return next })
  }, [symptoms, user.id])

  return (
    <SymptomsContext.Provider value={{ symptoms, loading, error, refetch, addSymptom, saveSymptom, resolve, unresolve }}>
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
