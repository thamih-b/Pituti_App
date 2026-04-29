import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react'
import type { CareEditData } from '../components/EditCareModal'

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface CareItem {
  id:           string
  petId:        string
  emoji:        string
  title:        string
  sub:          string
  total:        number
  period:       string    // 'day' | 'week' | 'month' | 'custom'
  intervalDays: number    // 1=diário, 7=semanal, 30=mensal, ou valor custom
  startDate:    string    // YYYY-MM-DD âncora
  quantity:     string
  notify:       boolean
  time:         string
  recurring:    boolean
  bg:           string
  doneByDate:   Record<string, { done: number; doneState: boolean }>
}

// addCare pode omitir o id (gerado automaticamente) e o doneByDate
type NewCareItem = Omit<CareItem, 'id' | 'doneByDate'> & { id?: string; doneByDate?: CareItem['doneByDate'] }

interface CaresContextValue {
  items:          CareItem[]
  setCareProgress:(id: string, dateStr: string, done: number, doneState: boolean) => void
  /** PetDetailPage: actualiza com um CareItem completo já construído */
  editCare:       (care: CareItem) => void
  /** CalendarPage: actualiza a partir do CareEditData do modal */
  updateCare:     (updated: CareEditData) => void
  deleteCare:     (id: string) => void
  addCare:        (item: NewCareItem) => void
}

// ── Funções utilitárias públicas ──────────────────────────────────────────────

/**
 * Devolve todas as datas (YYYY-MM-DD) em que este cuidado ocorre no intervalo
 * [fromStr, toStr], respeitando `intervalDays` e o `startDate` como âncora.
 */
export function getDueDatesInRange(
  care: CareItem, fromStr: string, toStr: string,
): string[] {
  const result: string[] = []
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  const to    = new Date(toStr          + 'T12:00:00')
  let cur = new Date(start)
  while (cur < from) cur.setDate(cur.getDate() + care.intervalDays)
  while (cur <= to) {
    result.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + care.intervalDays)
  }
  return result
}

/**
 * Verifica se o cuidado deve ocorrer numa data específica.
 * Para cuidados diários (intervalDays ≤ 1) devolve sempre true.
 */
export function isDueOnDate(care: CareItem, dateStr: string): boolean {
  if (care.intervalDays <= 1) return true
  return getDueDatesInRange(care, dateStr, dateStr).length > 0
}

/**
 * Devolve a próxima data de ocorrência do cuidado após `fromStr`.
 */
export function getNextDueDate(care: CareItem, fromStr: string): string {
  if (care.intervalDays <= 1) return fromStr
  const start = new Date(care.startDate + 'T12:00:00')
  const from  = new Date(fromStr        + 'T12:00:00')
  let cur = new Date(start)
  // avança até passar `from`
  while (cur <= from) cur.setDate(cur.getDate() + care.intervalDays)
  return cur.toISOString().split('T')[0]
}

// ── Funções internas ──────────────────────────────────────────────────────────

function periodToInterval(period: string): number {
  if (period === 'week')  return 7
  if (period === 'month') return 30
  return 1
}

/**
 * Resolve o intervalDays final a partir do CareEditData.
 * Se period='custom', usa u.intervalDays directamente (mínimo 2 dias).
 */
function resolveIntervalDays(u: CareEditData): number {
  if (u.period === 'custom' && u.intervalDays != null) {
    return Math.max(2, Number(u.intervalDays) || 2)
  }
  return periodToInterval(u.period ?? 'day')
}

/**
 * Constrói o texto "sub" do cuidado (ex: "2 al día · 80g").
 * Suporta period === 'custom' com intervalDays arbitrário.
 */
function buildSub(u: CareEditData): string {
  let freq: string
  const xd = u.intervalDays ?? 2
  switch (u.period ?? 'day') {
    case 'day':    freq = 'al día';                      break
    case 'week':   freq = 'por semana';                  break
    case 'month':  freq = 'por mes';                     break
    case 'custom': freq = `cada ${xd} día${xd !== 1 ? 's' : ''}`; break
    default:       freq = 'al día'
  }
  const qty = u.quantity?.trim() ? ` · ${u.quantity.trim()}` : ''
  return `${u.total} ${freq}${qty}`
}

// ── Dados iniciais ────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const INITIAL: CareItem[] = [
  {
    id:'care-luna-food',  petId:'pet-1', emoji:'🍽️', title:'Alimentación',
    sub:'2 al día · 80g', total:2, period:'day',    intervalDays:1,
    startDate:today, quantity:'80g', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#FFF3DC,#FFE0A0)', doneByDate:{},
  },
  {
    id:'care-luna-brush', petId:'pet-1', emoji:'🪮',  title:'Cepillado',
    sub:'1 por semana',   total:1, period:'week',   intervalDays:7,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#F0E8FF,#DDD0FF)', doneByDate:{},
  },
  {
    id:'care-luna-bath',  petId:'pet-1', emoji:'🛁',  title:'Baño',
    sub:'1 cada 14 días', total:1, period:'custom', intervalDays:14,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E0F8FF,#A8DCFF)', doneByDate:{},
  },
  {
    id:'care-toby-water', petId:'pet-2', emoji:'💧',  title:'Agua fresca',
    sub:'3 al día',       total:3, period:'day',    intervalDays:1,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneByDate:{},
  },
  {
    id:'care-toby-walk',  petId:'pet-2', emoji:'🦮',  title:'Paseo',
    sub:'2 al día',       total:2, period:'day',    intervalDays:1,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E8FFE8,#B8F0B8)', doneByDate:{},
  },
  {
    id:'care-kiwi-water', petId:'pet-3', emoji:'💧',  title:'Agua',
    sub:'2 al día',       total:2, period:'day',    intervalDays:1,
    startDate:today, quantity:'', notify:true, time:'', recurring:true,
    bg:'linear-gradient(135deg,#E0F4FF,#B8E0FF)', doneByDate:{},
  },
]

// ── Context ───────────────────────────────────────────────────────────────────

const CaresContext = createContext<CaresContextValue | null>(null)

export function CaresProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CareItem[]>(INITIAL)

  /** Regista o progresso de um cuidado numa data específica */
  const setCareProgress = useCallback((
    id: string, dateStr: string, done: number, doneState: boolean,
  ) => {
    setItems(prev => prev.map(c =>
      c.id !== id ? c : {
        ...c,
        doneByDate: { ...c.doneByDate, [dateStr]: { done, doneState } },
      }
    ))
  }, [])

  /**
   * PetDetailPage — recebe um CareItem completo já construído e substitui.
   * O sub, intervalDays, period, etc., já vêm calculados pelo chamador.
   */
  const editCare = useCallback((care: CareItem) => {
    setItems(prev => prev.map(c => c.id !== care.id ? c : { ...c, ...care }))
  }, [])

  /**
   * CalendarPage — recebe CareEditData do EditCareModal e recalcula
   * intervalDays e sub internamente, preservando valores custom.
   */
  const updateCare = useCallback((u: CareEditData) => {
    setItems(prev => prev.map(c =>
      c.id !== u.id ? c : {
        ...c,
        emoji:        u.emoji,
        title:        u.title,
        total:        Math.max(1, Number(u.total)),
        period:       u.period ?? 'day',
        intervalDays: resolveIntervalDays(u),
        quantity:     u.quantity ?? '',
        notify:       u.notify ?? true,
        time:         u.time     ?? c.time,
        recurring:    u.recurring ?? c.recurring,
        sub:          buildSub(u),
        bg:           u.bg ?? c.bg,
      }
    ))
  }, [])

  /** Remove um cuidado */
  const deleteCare = useCallback((id: string) => {
    setItems(prev => prev.filter(c => c.id !== id))
  }, [])

  /**
   * Adiciona um cuidado novo.
   * O id pode ser omitido — nesse caso é gerado automaticamente.
   */
  const addCare = useCallback((item: NewCareItem) => {
    const newItem: CareItem = {
      ...item,
      id:         item.id ?? `care-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      doneByDate: item.doneByDate ?? {},
    }
    setItems(prev => [...prev, newItem])
  }, [])

  return (
    <CaresContext.Provider value={{ items, setCareProgress, editCare, updateCare, deleteCare, addCare }}>
      {children}
    </CaresContext.Provider>
  )
}

export function useCares() {
  const ctx = useContext(CaresContext)
  if (!ctx) throw new Error('useCares must be used inside <CaresProvider>')
  return ctx
}

/** Hook para obter apenas os cuidados de uma pet específica */
export function usePetCares(petId: string): CareItem[] {
  const { items } = useCares()
  return items.filter(c => c.petId === petId)
}
