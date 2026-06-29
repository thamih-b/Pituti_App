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

// ─── Funções utilitárias exportadas ────────────────────────────────────────────

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

// FIX: exportar getNextDueDate — em falta no ficheiro anterior, causava build error
export function getNextDueDate(care: CareItem, fromStr: string): string {
  if (care.intervalDays <= 1) return fromStr
  const start = new Date(care.startDate + 'T12:00:00')
  const from = new Date(fromStr + 'T12:00:00')
  let cur = new Date(start)
  while (cur <= from) cur.setDate(cur.getDate() + care.intervalDays)
  return cur.toISOString().split('T')[0]
}

// ─── Helpers internos ──────────────────────────────────────────────────────────

function periodToInterval(p: string): number {
  return p === 'week' ? 7 : p === 'month' ? 30 : 1
}

function resolveIntervalDays(u: CareEditData): number {
  if (u.period === 'custom' && u.intervalDays != null) return Math.max(2, Number(u.intervalDays) || 2)
  return periodToInterval(u.period ?? 'day')
}

function buildSub(u: CareEditData, t: TFunction): string {
  const xd = u.intervalDays ?? 2
  const freq =
    u.period === 'day' ? t('cares.sub.perDay')
    : u.period === 'week' ? t('cares.sub.perWeek')
    : u.period === 'month' ? t('cares.sub.perMonth')
    : t('cares.sub.everyNDays', { count: xd })
  return u.total > 1 && u.quantity?.trim() ? u.quantity.trim() : freq
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

const CARE_EMOJI: Record<string, string> = {
  food: '🍽️', water: '💧', walk: '🦮', bath: '🛁',
  brush: '🪮', medication: '💊', other: '⭐',
}
const CARE_BG: Record<string, string> = {
  food: 'linear-gradient(135deg,#FFF3DC,#FFE0A0)',
  water: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)',
  walk: 'linear-gradient(135deg,#E8FFE8,#B8F0B8)',
  bath: 'linear-gradient(135deg,#E0F8FF,#A8DCFF)',
  brush: 'linear-gradient(135deg,#F0E8FF,#DDD0FF)',
  other: 'linear-gradient(135deg,#F5F5F5,#E0E0E0)',
}

const todayStr = new Date().toISOString().split('T')[0]

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
    startDate: (c as any).createdAt?.split('T')[0] ?? todayStr,
    quantity: c.notes ?? '',
    notify: true,
    time: (c as any).time ?? '',
    recurring: true,
    bg: CARE_BG[c.type ?? 'other'] ?? CARE_BG.other,
    doneByDate: {},
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  // FIX: incluir `ready` — evita carregar com user.id vazio após reload
  const { user, isAuthenticated, ready } = useUser()
  const [items, setItems] = useState<CareItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // FIX: aguardar ready antes de qualquer acesso ao localStorage ou API
    if (!ready || !isAuthenticated || !user.id) return

    let cancelled = false
    setLoading(true)
    setError(null)

    // 1. localStorage imediato (chave correcta com user.id real)
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
          item.id !== id
            ? item
            : { ...item, doneByDate: { ...item.doneByDate, [dateStr]: { done, doneState } } }
        )
        if (user.id) saveCares(user.id, next)
        return next
      })
    },
    [user.id]
  )

  const editCare = useCallback((care: CareItem) => {
    setItems(prev => prev.map(c => (c.id !== care.id ? c : { ...c, ...care })))
  }, [])

  const updateCare = useCallback(
    (u: CareEditData) => {
      setItems(prev => {
        const next = prev.map(c =>
          c.id !== u.id
            ? c
            : {
                ...c,
                emoji: u.emoji,
                title: u.title,
                total: Math.max(1, Number(u.total)),
                period: u.period ?? 'day',
                intervalDays: resolveIntervalDays(u),
                quantity: u.quantity ?? '',
                notify: u.notify ?? true,
                time: u.time ?? c.time,
                recurring: (u as any).recurring ?? c.recurring,
                sub: buildSub(u, t),
                bg: u.bg ?? c.bg,
              }
        )
        if (user.id) saveCares(user.id, next)
        return next
      })
    },
    [t, user.id]
  )

  const deleteCare = useCallback(
    async (id: string) => {
      const care = items.find(c => c.id === id)
      if (care) {
        try {
          await caresApi.delete(care.petId, id)
        } catch {
          // silencia
        }
      }
      setItems(prev => {
        const next = prev.filter(c => c.id !== id)
        if (user.id) saveCares(user.id, next)
        return next
      })
    },
    [items, user.id]
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
          type:
            item.emoji === '🍽️' ? 'food'
            : item.emoji === '💧' ? 'water'
            : item.emoji === '🦮' ? 'walk'
            : item.emoji === '🛁' ? 'bath'
            : item.emoji === '🪮' ? 'brush'
            : item.emoji === '💊' ? 'medication'
            : 'other',
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

  const value: CaresContextValue = {
    items,
    loading,
    error,
    setCareProgress,
    editCare,
    updateCare,
    deleteCare,
    addCare,
  }

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
