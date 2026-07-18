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
import type { ApiCare, UpdateCareDto } from '../api'
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
  refresh: () => Promise<void>
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

// FIX (sync): inverso de CARE_EMOJI, necessário para reconstruir o `type`
// (campo obrigatório na API) a partir do emoji guardado localmente.
function emojiToType(emoji: string): string {
  const found = Object.entries(CARE_EMOJI).find(([, e]) => e === emoji)
  return found?.[0] ?? 'other'
}

const todayStr = new Date().toISOString().split('T')[0]

// FIX (sync): antes, esta função ignorava por completo o período (day/week/month),
// o intervalo customizado e o estado diário de conclusão vindos da API — devolvia
// sempre period:'day', intervalDays:1 e doneByDate:{}. Isso fazia com que, ao abrir
// a app noutro aparelho, os cuidados voltassem sempre ao valor por omissão em vez
// de mostrarem o que foi realmente configurado/concluído.
function mapApiCare(c: ApiCare, petId: string, t: TFunction): CareItem {
  const freq = typeof c.frequency === 'number' ? c.frequency : 1

  let period = 'day'
  let intervalDays = 1
  if (c.periodType === 'week') {
    period = 'week'
    intervalDays = 7
  } else if (c.periodType === 'month') {
    period = 'month'
    intervalDays = 30
  } else if (c.periodType === 'day') {
    period = 'day'
    intervalDays = 1
  } else if (c.intervalDays != null && c.intervalDays > 1) {
    // periodType não guardado no servidor → período "personalizado" (a cada X dias)
    period = 'custom'
    intervalDays = c.intervalDays
  }

  return {
    id: c.id,
    petId,
    emoji: CARE_EMOJI[c.type ?? 'other'] ?? '⭐',
    title: c.name,
    sub: buildSub({ period, intervalDays, total: freq, quantity: c.notes ?? '' } as CareEditData, t),
    total: freq,
    period,
    intervalDays,
    startDate: (c as any).createdAt?.split('T')[0] ?? todayStr,
    quantity: c.notes ?? '',
    notify: true,
    time: c.time ?? '',
    recurring: true,
    bg: CARE_BG[c.type ?? 'other'] ?? CARE_BG.other,
    // FIX (sync): estado diário de conclusão, agora persistido no servidor
    doneByDate: c.doneDates ?? {},
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

  // FIX (sync): `refresh` passou a ser a única fonte de verdade — sem
  // localStorage. Segue o mesmo padrão já validado em PetsContext.
  const refresh = useCallback(async () => {
    if (!ready || !isAuthenticated || !user.id) return
    setLoading(true)
    setError(null)
    try {
      const petsRes = await petsApi.getAll(user.id)
      const pets = petsRes.data as any[]
      const results = await Promise.all(
        pets.map(p =>
          caresApi
            .getAll(p.id)
            .then(r => (r.data as any[]).map(c => mapApiCare(c, p.id, t)))
            .catch(() => [] as CareItem[])
        )
      )
      setItems(results.flat())
    } catch (e: any) {
      setError(e?.message ?? t('cares.errorLoading'))
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user.id, ready, t])

  useEffect(() => {
    if (ready && isAuthenticated && user.id) {
      refresh()
    } else if (ready && !isAuthenticated) {
      setItems([])
    }
  }, [isAuthenticated, user.id, ready, refresh])

  // FIX (sync): antes só gravava em localStorage. Agora persiste o estado
  // diário de conclusão no servidor (coluna done_dates), para aparecer igual
  // em qualquer aparelho onde o utilizador entre.
  const setCareProgress = useCallback(
    (id: string, dateStr: string, done: number, doneState: boolean) => {
      const care = items.find(c => c.id === id)
      if (!care) return
      const nextDoneByDate = { ...care.doneByDate, [dateStr]: { done, doneState } }

      // Atualização otimista local
      setItems(prev => prev.map(item => (item.id !== id ? item : { ...item, doneByDate: nextDoneByDate })))

      caresApi.update(care.petId, id, { doneDates: nextDoneByDate }).catch(e => {
        // reverte em caso de falha e avisa
        setItems(prev => prev.map(item => (item.id !== id ? item : { ...item, doneByDate: care.doneByDate })))
        setError(e?.message ?? t('cares.errorLoading'))
      })
    },
    [items, t]
  )

  // FIX (sync): editCare (usado no ecrã de Cuidados) agora grava na API —
  // antes só alterava o estado em memória do aparelho atual.
  const editCare = useCallback(
    (care: CareItem) => {
      const dto: UpdateCareDto = {
        name: care.title,
        type: emojiToType(care.emoji),
        frequency: care.total,
        periodType: (care.period === 'day' || care.period === 'week' || care.period === 'month' ? care.period : null) as any,
        intervalDays: care.period === 'custom' ? care.intervalDays : null,
        time: care.time || null,
        notes: care.quantity || null,
      }

      setItems(prev => prev.map(c => (c.id !== care.id ? c : { ...c, ...care })))

      caresApi
        .update(care.petId, care.id, dto)
        .then(res => {
          const updated = mapApiCare(res.data, care.petId, t)
          setItems(prev => prev.map(c => (c.id !== care.id ? c : { ...updated, doneByDate: c.doneByDate })))
        })
        .catch(e => setError(e?.message ?? t('cares.errorLoading')))
    },
    [t]
  )

  // FIX (sync): updateCare (usado no Dashboard/EditCareModal) agora grava na
  // API — antes só persistia em localStorage.
  const updateCare = useCallback(
    (u: CareEditData) => {
      const current = items.find(c => c.id === u.id)
      if (!current) return

      const intervalDays = resolveIntervalDays(u)
      const nextLocal: CareItem = {
        ...current,
        emoji: u.emoji,
        title: u.title,
        total: Math.max(1, Number(u.total)),
        period: u.period ?? 'day',
        intervalDays,
        quantity: u.quantity ?? '',
        notify: u.notify ?? true,
        time: u.time ?? current.time,
        recurring: (u as any).recurring ?? current.recurring,
        sub: buildSub(u, t),
        bg: u.bg ?? current.bg,
      }

      setItems(prev => prev.map(c => (c.id !== u.id ? c : nextLocal)))

      const dto: UpdateCareDto = {
        name: u.title,
        type: emojiToType(u.emoji),
        frequency: Math.max(1, Number(u.total)),
        periodType: (u.period === 'day' || u.period === 'week' || u.period === 'month' ? u.period : null) as any,
        intervalDays: u.period === 'custom' ? intervalDays : null,
        time: u.time || null,
        notes: u.quantity || null,
      }

      caresApi
        .update(current.petId, u.id, dto)
        .then(res => {
          const updated = mapApiCare(res.data, current.petId, t)
          setItems(prev => prev.map(c => (c.id !== u.id ? c : { ...updated, doneByDate: c.doneByDate })))
        })
        .catch(e => setError(e?.message ?? t('cares.errorLoading')))
    },
    [items, t]
  )

  const deleteCare = useCallback(
    async (id: string) => {
      const care = items.find(c => c.id === id)
      if (!care) return
      // Atualização otimista: remove já da lista local
      setItems(prev => prev.filter(c => c.id !== id))
      try {
        await caresApi.delete(care.petId, id)
      } catch (e: any) {
        // falhou no servidor → repõe o item localmente
        setItems(prev => [...prev, care])
        setError(e?.message ?? t('cares.errorLoading'))
      }
    },
    [items, t]
  )

  // FIX (sync): addCare deixou de ter um "modo local" — todo o cuidado tem de
  // existir no servidor para poder ser visto noutros aparelhos. Se a API
  // falhar, o item NÃO é criado localmente (evita fantasmas que nunca
  // existiram no servidor e desaparecem ao mudar de aparelho).
  const addCare = useCallback(
    async (item: NewCareItem) => {
      if (!item.petId) {
        setError(t('cares.errorLoading'))
        return
      }
      try {
        const dto = {
          name: item.title,
          type: emojiToType(item.emoji),
          frequency: item.total,
          periodType: (item.period === 'day' || item.period === 'week' || item.period === 'month' ? item.period : null) as any,
          intervalDays: item.period === 'custom' ? item.intervalDays : null,
          time: item.time || null,
          notes: item.quantity || null,
          status: 'pending' as const,
        }
        const res = await caresApi.create(item.petId, dto)
        const created = mapApiCare(res.data, item.petId, t)
        setItems(prev => [...prev, created])
      } catch (e: any) {
        setError(e?.message ?? t('cares.errorLoading'))
      }
    },
    [t]
  )

  const value: CaresContextValue = {
    items,
    loading,
    error,
    refresh,
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
