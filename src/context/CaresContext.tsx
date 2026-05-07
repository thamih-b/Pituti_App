// traduzido e sem mock

import {
  createContext, useContext, useState, useCallback, useEffect, type ReactNode,
} from 'react'
import type { CareEditData } from '../components/EditCareModal'
import { petsApi, caresApi } from '../api'
import type { ApiCare } from '../api'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'


export interface CareItem {
  id: string; petId: string; emoji: string; title: string; sub: string
  total: number; period: string; intervalDays: number; startDate: string
  quantity: string; notify: boolean; time: string; recurring: boolean
  bg: string; doneByDate: Record<string, { done: number; doneState: boolean }>
}

type NewCareItem = Omit<CareItem, 'id' | 'doneByDate'> & { id?: string; doneByDate?: CareItem['doneByDate'] }

interface CaresContextValue {
  items:           CareItem[]
  loading:         boolean
  error:           string | null
  setCareProgress: (id: string, dateStr: string, done: number, doneState: boolean) => void
  editCare:        (care: CareItem) => void
  updateCare:      (updated: CareEditData) => void
  deleteCare:      (id: string) => void
  addCare:         (item: NewCareItem) => void
}

export function getDueDatesInRange(care: CareItem, fromStr: string, toStr: string): string[] {
  const result: string[] = []
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  const to    = new Date(toStr          + 'T12:00:00')
  let cur = new Date(start)
  while (cur < from) cur.setDate(cur.getDate() + care.intervalDays)
  while (cur <= to)  { result.push(cur.toISOString().split('T')[0]); cur.setDate(cur.getDate() + care.intervalDays) }
  return result
}

export function isDueOnDate(care: CareItem, dateStr: string): boolean {
  if (care.intervalDays <= 1) return true
  return getDueDatesInRange(care, dateStr, dateStr).length > 0
}

export function getNextDueDate(care: CareItem, fromStr: string): string {
  if (care.intervalDays <= 1) return fromStr
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  let cur = new Date(start)
  while (cur <= from) cur.setDate(cur.getDate() + care.intervalDays)
  return cur.toISOString().split('T')[0]
}

function periodToInterval(p: string) { return p === 'week' ? 7 : p === 'month' ? 30 : 1 }

function resolveIntervalDays(u: CareEditData): number {
  if (u.period === 'custom' && u.intervalDays != null) return Math.max(2, Number(u.intervalDays) || 2)
  return periodToInterval(u.period ?? 'day')
}

// buildSub recebe t() para não usar strings hardcoded
function buildSub(u: CareEditData, t: TFunction): string {
  const xd   = u.intervalDays ?? 2
  const freq = u.period === 'day'   ? t('cares.sub.perDay')
             : u.period === 'week'  ? t('cares.sub.perWeek')
             : u.period === 'month' ? t('cares.sub.perMonth')
             : t('cares.sub.everyNDays', { count: xd })
  return `${u.total} ${freq}${u.quantity?.trim() ? ` · ${u.quantity.trim()}` : ''}`
}

const CARE_EMOJI: Record<string, string> = {
  food: '🍽️', water: '💧', walk: '🦮', bath: '🛁',
  brush: '🪮', medication: '💊', other: '🐾',
}
const CARE_BG: Record<string, string> = {
  food:  'linear-gradient(135deg,#FFF3DC,#FFE0A0)',
  water: 'linear-gradient(135deg,#E0F4FF,#B8E0FF)',
  walk:  'linear-gradient(135deg,#E8FFE8,#B8F0B8)',
  bath:  'linear-gradient(135deg,#E0F8FF,#A8DCFF)',
  brush: 'linear-gradient(135deg,#F0E8FF,#DDD0FF)',
  other: 'linear-gradient(135deg,#F5F5F5,#E0E0E0)',
}

const today = new Date().toISOString().split('T')[0]

// mapApiCare recebe t() para traduzir o sub gerado pela API

function mapApiCare(c: ApiCare, petId: string, t: TFunction): CareItem {
  const freq = typeof c.frequency === 'number' ? c.frequency : 1
  return {
    id: c.id, petId,
    emoji:      CARE_EMOJI[c.type ?? 'other'] ?? '🐾',
    title:      c.name,
    sub:        `${freq} ${t('cares.sub.perDay')}`,
    total:      freq,
    period:     'day', intervalDays: 1,
    startDate:  c.createdAt?.split('T')[0] ?? today,
    quantity:   c.notes ?? '', notify: true, time: c.time ?? '', recurring: true,
    bg:         CARE_BG[c.type ?? 'other'] ?? CARE_BG.other,
    doneByDate: {},
  }
}
const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()

  const [items,   setItems]   = useState<CareItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    petsApi.getAll()
      .then(async res => {
        const pets = res.data
        const results = await Promise.all(
          pets.map(p =>
            caresApi.getAll(p.id)
              .then(r => r.data.map(c => mapApiCare(c, p.id, t)))
              .catch(() => [] as CareItem[])
          )
        )
        if (cancelled) return
        setItems(results.flat())
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? t('cares.errorLoading')) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [t])

  const setCareProgress = useCallback((id: string, dateStr: string, done: number, doneState: boolean) =>
    setItems(prev => prev.map(c => c.id !== id ? c : {
      ...c, doneByDate: { ...c.doneByDate, [dateStr]: { done, doneState } },
    })), [])

  const editCare = useCallback((care: CareItem) =>
    setItems(prev => prev.map(c => c.id !== care.id ? c : { ...c, ...care })), [])

  const updateCare = useCallback((u: CareEditData) =>
    setItems(prev => prev.map(c => c.id !== u.id ? c : {
      ...c,
      emoji:        u.emoji,
      title:        u.title,
      total:        Math.max(1, Number(u.total)),
      period:       u.period ?? 'day',
      intervalDays: resolveIntervalDays(u),
      quantity:     u.quantity ?? '',
      notify:       u.notify ?? true,
      time:         u.time ?? c.time,
      recurring:    u.recurring ?? c.recurring,
      sub:          buildSub(u, t),
      bg:           u.bg ?? c.bg,
    })), [t])

  const deleteCare = useCallback((id: string) =>
    setItems(prev => prev.filter(c => c.id !== id)), [])

  const addCare = useCallback((item: NewCareItem) =>
    setItems(prev => [...prev, {
      ...item,
      id:         item.id         ?? `care-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      doneByDate: item.doneByDate ?? {},
    }]), [])

  return (
    <CaresContext.Provider value={{ items, loading, error, setCareProgress, editCare, updateCare, deleteCare, addCare }}>
      {children}
    </CaresContext.Provider>
  )
}

export function useCares() {
  const ctx = useContext(CaresContext)
  if (!ctx) throw new Error('useCares must be used inside <CaresProvider>')
  return ctx
}

export function usePetCares(petId: string): CareItem[] {
  const { items } = useCares()
  return items.filter(c => c.petId === petId)
}