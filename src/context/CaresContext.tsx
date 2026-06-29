import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { CareEditData } from '../components/EditCareModal'
import { petsApi, caresApi } from '../api'
import type { ApiCare } from '../api'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { useUser } from './UserContext'

export interface CareItem {
  id: string
  petId: string
  emoji: string
  title: string
  sub: string
  total: number
  period: string
  intervalDays: number
  startDate: string
  quantity: string
  notify: boolean
  time: string
  recurring: boolean
  bg: string
  doneByDate: Record<string, { done: number; doneState: boolean }>
}

type NewCareItem = Omit<CareItem, 'id' | 'doneByDate'> & { id?: string; doneByDate?: CareItem['doneByDate'] }

interface CaresContextValue {
  items: CareItem[]
  loading: boolean
  error: string | null
  setCareProgress: (id: string, dateStr: string, done: number, doneState: boolean) => void
  editCare: (care: CareItem) => void
  updateCare: (updated: CareEditData) => void
  deleteCare: (id: string) => void
  addCare: (item: NewCareItem) => void
}

export function getDueDatesInRange(care: CareItem, fromStr: string, toStr: string): string[] {
  const result: string[] = []
  const start = new Date(care.startDate + 'T12:00:00')
  const from = new Date(fromStr + 'T12:00:00')
  const to = new Date(toStr + 'T12:00:00')
  let cur = new Date(start)
  while (cur < from) cur.setDate(cur.getDate() + care.intervalDays)
  while (cur <= to) {
    result.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + care.intervalDays)
  }
  return result
}

export function isDueOnDate(care: CareItem, dateStr: string): boolean {
  if (care.intervalDays <= 1) return true
  return getDueDatesInRange(care, dateStr, dateStr).length > 0
}

const CARE_EMOJI: Record<string, string> = {
  food: '🍽️', water: '💧', walk: '🦮', bath: '🛁',
  brush: '🪮', medication: '💊', other: '⭐',
}
const CARE_BG: Record<string, string> = {
  food: 'var(--warn-hl)', water: 'var(--blue-hl)', walk: 'var(--success-hl)',
  bath: 'var(--primary-hl)', brush: 'var(--purple-hl)', medication: 'var(--pal-candy)',
  other: 'var(--surface-offset)',
}

// Persistência localStorage
function loadCares(userId: string): CareItem[] {
  if (!userId) return []
  try {
    return JSON.parse(localStorage.getItem(`pituti-cares-${userId}`) ?? 'null') ?? []
  } catch {
    return []
  }
}

function saveCares(userId: string, items: CareItem[]): void {
  if (!userId) return
  try {
    localStorage.setItem(`pituti-cares-${userId}`, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function mapApiCare(c: ApiCare, petId: string, t: TFunction): CareItem {
  const freq = typeof c.frequency === 'number' ? c.frequency : 1
  return {
    id: c.id,
    petId,
    emoji: CARE_EMOJI[c.type ?? 'other'] ?? '⭐',
    title: c.name,
    sub: freq > 1 ? t('cares.sub.perDay') : t('cares.sub.perDay'),
    total: freq,
    period: 'day',
    intervalDays: 1,
    startDate: (c as any).createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    quantity: c.notes ?? '',
    notify: true,
    time: (c as any).time ?? '',
    recurring: true,
    bg: CARE_BG[c.type ?? 'other'] ?? CARE_BG.other,
    doneByDate: {},
  }
}

const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  // FIX: incluir `ready` para evitar carregar com user.id vazio
  const { user, isAuthenticated, ready } = useUser()
  const [items, setItems] = useState<CareItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // FIX: aguardar ready
    if (!ready || !isAuthenticated || !user.id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    // 1. localStorage imediato
    const stored = loadCares(user.id)
    if (stored.length) setItems(stored)

    // 2. API em background
    petsApi
      .getAll(user.id)
      .then(async res => {
        const pets = res.data as any[]
        const results = await Promise.all(
          pets.map(p =>
            caresApi
              .getAll(p.id)
              .then(r => (r.data as any[]).map(c => mapApiCare(c, p.id, t)))
              .catch(() => [] as CareItem[])
          )
        )
        if (!cancelled) {
          const apiCares = results.flat()
          if (apiCares.length) {
            setItems(apiCares)
            saveCares(user.id, apiCares)
          }
        }
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? t('cares.errorLoading'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [ready, isAuthenticated, user.id, t])

  const setCareProgress = useCallback(
    (id: string, dateStr: string, done: number, doneState: boolean) => {
      setItems(prev => {
        const next = prev.map(item =>
          item.id === id
            ? { ...item, doneByDate: { ...item.doneByDate, [dateStr]: { done, doneState } } }
            : item
        )
        if (user.id) saveCares(user.id, next)
        return next
      })
    },
    [user.id]
  )

  const editCare = useCallback((_care: CareItem) => {
    // abre modal externamente — sem estado aqui
  }, [])

  const updateCare = useCallback(
    (updated: CareEditData) => {
      setItems(prev => {
        const next = prev.map(item =>
          item.id === updated.id ? { ...item, ...updated } : item
        )
        if (user.id) saveCares(user.id, next)
        return next
      })
    },
    [user.id]
  )

  const deleteCare = useCallback(
    (id: string) => {
      setItems(prev => {
        const next = prev.filter(item => item.id !== id)
        if (user.id) saveCares(user.id, next)
        return next
      })
    },
    [user.id]
  )

  const addCare = useCallback(
    async (item: NewCareItem) => {
      if (!item.petId) {
        setItems(prev => {
          const next = [...prev, { ...item, id: `care-${Date.now()}`, doneByDate: {} }]
          if (user.id) saveCares(user.id, next)
          return next
        })
        return
      }
      try {
        const dto = {
          name: item.title,
          type: item.emoji === '🍽️' ? 'food' : item.emoji === '💧' ? 'water'
              : item.emoji === '🦮' ? 'walk' : item.emoji === '🛁' ? 'bath'
              : item.emoji === '🪮' ? 'brush' : item.emoji === '💊' ? 'medication' : 'other',
          frequency: item.total,
          periodType: item.period as any,
          time: item.time,
          notes: item.quantity,
          status: 'pending' as const,
          startDate: item.startDate,
        }
        const res = await caresApi.create(item.petId, dto)
        const created = mapApiCare(res.data, item.petId, t)
        setItems(prev => {
          const next = [...prev, { ...created, doneByDate: {} }]
          if (user.id) saveCares(user.id, next)
          return next
        })
      } catch {
        // fallback local se API falhar
        setItems(prev => {
          const next = [
            ...prev,
            { ...item, id: item.id ?? `care-${Date.now()}`, doneByDate: item.doneByDate ?? {} },
          ]
          if (user.id) saveCares(user.id, next)
          return next
        })
      }
    },
    [t, user.id]
  )

  const value: CaresContextValue = { items, loading, error, setCareProgress, editCare, updateCare, deleteCare, addCare }

  return <CaresContext.Provider value={value}>{children}</CaresContext.Provider>
}

export function useCares() {
  const ctx = useContext(CaresContext)
  if (!ctx) throw new Error('useCares must be inside CaresProvider')
  return ctx
}

export function usePetCares(petId: string): CareItem[] {
  const { items } = useCares()
  return items.filter(c => c.petId === petId)
}
