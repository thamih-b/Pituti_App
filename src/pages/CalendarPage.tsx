import { useState, useMemo, useEffect, useRef } from 'react'
import { useCares } from '../context/CaresContext'
import { MOCK_PETS, VACCINES_BY_PET, SPECIES_EMOJI } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { useVet } from '../context/VetContext'
import type { CareEditData } from '../components/EditCareModal'
import EditCareModal from '../components/EditCareModal'
import { useMedications } from '../context/MedicationsContext'

const L = {
  pageTitle: 'Calendario',
  pageSubtitle: 'Vista mensual de cuidados, vacunas, medicación y veterinaria',

  alertsTitle: 'Vacunas vencidas',
  alertsWarn: '⚠ Consulta con el veterinario lo antes posible',
  vacExpiredTag: 'VENCIDA',
  vacExpiredSince: 'Venció:',

  today: 'Hoy',
  filterLabel: 'Filtrar calendario',
  clearFilters: 'Limpiar filtros',

  filterGroupCares: 'Cuidados',
  filterGroupVaccines: 'Vacunas',
  filterGroupVet: 'Veterinaria',
  filterGroupMedications: 'Medicamentos',

  filterPending: 'Pendiente',
  filterDone: 'Realizado',
  filterVaccDue: 'Próxima vacuna',
  filterVaccExpired: 'Vacuna vencida',
  filterVetVisit: 'Consulta vet.',
  filterVetReturn: 'Retorno',
  filterMedication: 'Medicación',

  dayEmpty: 'Sin eventos este día',
  dayCares: 'Cuidados del día',
  dayVaccines: 'Vacunas',
  dayVetVisits: 'Consultas / Citas',
  dayMedications: 'Medicación',
  editCare: 'Editar cuidado',

  carePending: 'Pendiente',
  careDone: 'Realizado',
  careSkipped: 'Omitido',

  vaccineApply: 'Aplicar ahora',
  vaccineApplied: 'Aplicada',

  vetVisitKind: 'Consulta',
  vetReturnKind: 'Retorno programado',

  eventsCount: (n: number) => `${n} evento${n !== 1 ? 's' : ''}`,
  monthPrev: 'Mes anterior',
  monthNext: 'Mes siguiente',

  weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
} as const

interface FilterChip {
  key: string
  label: string
  color: string
  bg: string
  emoji: string
}

const FILTER_GROUPS: { id: string; label: string; filters: FilterChip[] }[] = [
  {
    id: 'vet',
    label: L.filterGroupVet,
    filters: [
      {
        key: 'vet_visit',
        label: L.filterVetVisit,
        color: 'var(--primary)',
        bg: 'var(--primary-hl)',
        emoji: '🩺',
      },
      {
        key: 'vet_return',
        label: L.filterVetReturn,
        color: 'var(--blue)',
        bg: 'var(--blue-hl)',
        emoji: '📅',
      },
    ],
  },
  {
    id: 'medications',
    label: L.filterGroupMedications,
    filters: [
      {
        key: 'medication',
        label: L.filterMedication,
        color: 'var(--purple)',
        bg: 'var(--purple-hl)',
        emoji: '💊',
      },
    ],
  },
  {
    id: 'vaccines',
    label: L.filterGroupVaccines,
    filters: [
      {
        key: 'vacc_due',
        label: L.filterVaccDue,
        color: 'var(--blue)',
        bg: 'var(--blue-hl)',
        emoji: '💉',
      },
      {
        key: 'vacc_expired',
        label: L.filterVaccExpired,
        color: 'var(--err)',
        bg: 'var(--err-hl)',
        emoji: '🚨',
      },
    ],
  },
  {
    id: 'cares',
    label: L.filterGroupCares,
    filters: [
      {
        key: 'pending',
        label: L.filterPending,
        color: 'var(--warn)',
        bg: 'var(--warn-hl)',
        emoji: '⏳',
      },
      {
        key: 'done',
        label: L.filterDone,
        color: 'var(--success)',
        bg: 'var(--success-hl)',
        emoji: '✅',
      },
    ],
  },
]

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000)

const intervalToDays = (period: string, total: number) => {
  if (period === 'month') return Math.round(30 / total)
  if (period === 'week') return Math.round(7 / total)
  return Math.max(1, Math.round(1 / total))
}

type DoneByDate = Record<string, { done: number; total: number; doneState?: boolean }>
type CareStatus = 'done' | 'skip' | 'pending'

function getCareStatus(doneByDate: DoneByDate | undefined, day: string): CareStatus {
  const rec = doneByDate?.[day]
  if (!rec) return 'pending'
  if (rec.doneState) return 'done'
  return 'skip'
}

interface VaccEntry {
  vaccKey: string
  expired: boolean
}

interface VaccWithMeta extends VaccineRecord {
  petId: string
  petName: string
  petEmoji: string
}

type MedEv = {
  id: string
  date: string
  petId: string
  name: string
  dose?: string
  frequency?: string
  petName: string
  petEmoji: string
}

const MED_COLOR = 'var(--purple)'

export default function CalendarPage() {
  const today = new Date()
  const todayStr = toDateStr(today)

  const { items: careItems, setCareProgress, updateCare, deleteCare } = useCares()
  const { vetCalendarDates } = useVet()
  const { medications } = useMedications()

  type VetEv = (typeof vetCalendarDates)[number]

  const [extraVacc, setExtraVacc] = useState<Record<string, VaccineRecord[]>>({})
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState(todayStr)
  const [jumpMonth, setJumpMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
  )
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [editCareItem, setEditCareItem] = useState<CareEditData | null>(null)
  const [editCareOpen, setEditCareOpen] = useState(false)
  const [careExpandIdx, setCareExpandIdx] = useState<number | null>(null)
  const detailRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (window.innerWidth < 768) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedDay])

  const allVaccines = useMemo(
    (): VaccWithMeta[] =>
      MOCK_PETS.flatMap((p) =>
        [...(VACCINES_BY_PET[p.id] ?? []), ...(extraVacc[p.id] ?? [])].map((v) => ({
          ...v,
          petId: p.id,
          petName: p.name,
          petEmoji: SPECIES_EMOJI[p.species ?? ''] ?? '🐾',
        })),
      ),
    [extraVacc],
  )

  const handleVaccineApplied = (vaccKey: string, appliedDate: string) => {
    const [petId, ...nameParts] = vaccKey.split('::')
    const name = nameParts.join('::')
    const existing = allVaccines.find((v) => v.petId === petId && v.name === name)
    if (!existing) return

    const lbl = new Date(`${appliedDate}T12:00:00`).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    setExtraVacc((prev) => ({
      ...prev,
      [petId]: [
        ...(prev[petId] ?? []).filter((v) => v.name !== name),
        {
          ...existing,
          applied: lbl,
          nextDate: appliedDate,
          badge: 'APLICADA',
          badgeCls: 'badge-green',
        },
      ],
    }))
  }

  const medicationEventDates = useMemo<Record<string, MedEv[]>>(() => {
    const map: Record<string, MedEv[]> = {}

    const inferPetIdFromTitle = (title: string): string => {
      if (title.includes('Luna')) return 'pet-1'
      if (title.includes('Toby')) return 'pet-2'
      if (title.includes('Kiwi')) return 'pet-3'
      return 'pet-1'
    }

    const cleanMedName = (title: string): string =>
      title
        .replace('— Luna', '')
        .replace('— Toby', '')
        .replace('— Kiwi', '')
        .replace('🐱 Luna', '')
        .replace('🐶 Toby', '')
        .replace('🦜 Kiwi', '')
        .trim()

    for (const med of medications) {
      if (!med.startDate) continue

      const start = med.startDate
      const end = med.endDate || start

      const petId = inferPetIdFromTitle(med.title)
      const pet = MOCK_PETS.find((p) => p.id === petId)
      const petName = pet?.name ?? 'Mascota'
      const petEmoji = SPECIES_EMOJI[pet?.species ?? ''] ?? '💊'

      let cursor = new Date(`${start}T12:00:00`)
      const limit = new Date(`${end}T12:00:00`)

      const pushDay = (dateStr: string) => {
        if (!map[dateStr]) map[dateStr] = []
        map[dateStr].push({
          id: med.id,
          date: dateStr,
          petId,
          name: cleanMedName(med.title),
          dose: med.dose,
          frequency: med.frequency,
          petName,
          petEmoji,
        })
      }

      const freq = String(med.frequency || '').toLowerCase()

      if (
        freq.includes('12 horas') ||
        freq.includes('8 horas') ||
        freq.includes('diaria') ||
        freq.includes('diário') ||
        freq.includes('diario') ||
        freq.includes('daily')
      ) {
        while (cursor <= limit) {
          pushDay(cursor.toISOString().split('T')[0])
          cursor.setDate(cursor.getDate() + 1)
        }
        continue
      }

      if (freq.includes('semanal') || freq.includes('weekly')) {
        while (cursor <= limit) {
          pushDay(cursor.toISOString().split('T')[0])
          cursor.setDate(cursor.getDate() + 7)
        }
        continue
      }

      if (freq.includes('quincenal')) {
        while (cursor <= limit) {
          pushDay(cursor.toISOString().split('T')[0])
          cursor.setDate(cursor.getDate() + 15)
        }
        continue
      }

      if (freq.includes('mensual') || freq.includes('monthly')) {
        while (cursor <= limit) {
          pushDay(cursor.toISOString().split('T')[0])
          cursor.setMonth(cursor.getMonth() + 1)
        }
        continue
      }

      pushDay(start)
    }

    return map
  }, [medications])

  const careEventDates = useMemo(() => {
    const result: Record<string, { careId: string; seq: number }[]> = {}
    const monthStart = viewMonth
    const monthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0)

    for (const care of careItems) {
      const daysInterval =
        care.intervalDays > 0 ? care.intervalDays : intervalToDays(care.period ?? 'day', care.total)

      let cursor = addDays(monthStart, -90)
      let seq = 0

      while (cursor <= addDays(monthEnd, 30)) {
        const d = toDateStr(cursor)
        if (d >= toDateStr(monthStart) && d <= toDateStr(monthEnd)) {
          if (!result[d]) result[d] = []
          result[d].push({ careId: care.id, seq })
        }
        cursor = addDays(cursor, daysInterval)
        seq++
      }
    }

    return result
  }, [careItems, viewMonth])

  const vaccineEventDates = useMemo((): Record<string, VaccEntry[]> => {
    const map: Record<string, VaccEntry[]> = {}
    for (const vac of allVaccines) {
      if (!vac.nextDate) continue
      if (!map[vac.nextDate]) map[vac.nextDate] = []
      map[vac.nextDate].push({
        vaccKey: `${vac.petId}::${vac.name}`,
        expired: vac.nextDate < todayStr,
      })
    }
    return map
  }, [allVaccines, todayStr])

  const vetEventDates = useMemo((): Record<string, VetEv[]> => {
    const map: Record<string, VetEv[]> = {}
    for (const ev of vetCalendarDates) {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    }
    return map
  }, [vetCalendarDates])

  const monthCounts = useMemo(() => {
    const counts = {
      pending: 0,
      done: 0,
      vacc_due: 0,
      vacc_expired: 0,
      vet_visit: 0,
      vet_return: 0,
      medication: 0,
    }

    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const days = new Date(year, month + 1, 0).getDate()

    for (let d = 1; d <= days; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

      const cares = careEventDates[key] ?? []
      for (const { careId } of cares) {
        const care = careItems.find((c) => c.id === careId)
        if (!care) continue
        getCareStatus(care.doneByDate as DoneByDate, key) === 'done' ? counts.done++ : counts.pending++
      }

      const medsDay = medicationEventDates[key] ?? []
      counts.medication += medsDay.length

      const vaccDay = vaccineEventDates[key] ?? []
      for (const entry of vaccDay) {
        entry.expired ? counts.vacc_expired++ : counts.vacc_due++
      }

      const vetDay = vetEventDates[key] ?? []
      for (const ev of vetDay) {
        ev.kind === 'past' ? counts.vet_visit++ : counts.vet_return++
      }
    }

    return counts
  }, [careEventDates, careItems, medicationEventDates, vaccineEventDates, vetEventDates, viewMonth])

  const toggleFilter = (key: string) =>
    setActiveFilters((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const clearFilters = () => setActiveFilters(new Set())

  const dayPassesFilter = (day: string): boolean => {
    if (!activeFilters.size) return true

    const cares = careEventDates[day] ?? []

    if (
      activeFilters.has('pending') &&
      cares.some(({ careId }) => {
        const c = careItems.find((x) => x.id === careId)
        return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'pending'
      })
    ) {
      return true
    }

    if (
      activeFilters.has('done') &&
      cares.some(({ careId }) => {
        const c = careItems.find((x) => x.id === careId)
        return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'done'
      })
    ) {
      return true
    }

    const medsDay = medicationEventDates[day] ?? []
    if (activeFilters.has('medication') && medsDay.length > 0) return true

    const vaccDay = vaccineEventDates[day] ?? []
    if (activeFilters.has('vacc_due') && vaccDay.some((e) => !e.expired)) return true
    if (activeFilters.has('vacc_expired') && vaccDay.some((e) => e.expired)) return true

    const vetDay = vetEventDates[day] ?? []
    if (activeFilters.has('vet_visit') && vetDay.some((ev) => ev.kind === 'past')) return true
    if (activeFilters.has('vet_return') && vetDay.some((ev) => ev.kind === 'next')) return true

    return false
  }

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7

  const calendarCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1))

  const handleJumpChange = (val: string) => {
    setJumpMonth(val)
    const [y, m] = val.split('-').map(Number)
    if (y && m) setViewMonth(new Date(y, m - 1, 1))
  }

  const getDayDots = (day: string) => {
    const dots: { color: string; key: string }[] = []

    const cares = careEventDates[day] ?? []

    const hasPending = cares.some(({ careId }) => {
      const c = careItems.find((x) => x.id === careId)
      return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'pending'
    })

    const hasDone = cares.some(({ careId }) => {
      const c = careItems.find((x) => x.id === careId)
      return c && getCareStatus(c.doneByDate as DoneByDate, day) === 'done'
    })

    if (hasPending) dots.push({ color: 'var(--warn)', key: 'pending' })
    if (hasDone) dots.push({ color: 'var(--success)', key: 'done' })

    const meds = medicationEventDates[day] ?? []
    if (meds.length > 0) dots.push({ color: MED_COLOR, key: 'medication' })

    const vaccDay = vaccineEventDates[day] ?? []
    for (const entry of vaccDay) {
      dots.push({
        color: entry.expired ? 'var(--err)' : 'var(--blue)',
        key: `vacc-${entry.expired}`,
      })
    }

    const vetDay = vetEventDates[day] ?? []
    for (const ev of vetDay) {
      dots.push({
        color: ev.kind === 'past' ? 'var(--primary)' : 'var(--warn)',
        key: `vet-${ev.kind}-${ev.petId}`,
      })
    }

    return dots
  }

  const selectedDayCares = careEventDates[selectedDay] ?? []
  const selectedDayMeds: MedEv[] = medicationEventDates[selectedDay] ?? []
  const selectedDayVaccines = vaccineEventDates[selectedDay] ?? []
  const selectedDayVet = vetEventDates[selectedDay] ?? []

  const expiredVaccines = allVaccines.filter((v) => v.nextDate && v.nextDate < todayStr)
  const expiredVaccinesPreview = expiredVaccines.slice(0, 2)
  const expiredVaccinesRemaining = Math.max(0, expiredVaccines.length - expiredVaccinesPreview.length)

  const openEditCare = (careId: string) => {
    const care = careItems.find((c) => c.id === careId)
    if (!care) return

    setEditCareItem({
      id: care.id,
      emoji: care.emoji,
      title: care.title,
      total: care.total,
      period: care.period,
      intervalDays: care.intervalDays,
      quantity: care.quantity ?? '',
      notify: care.notify,
      time: care.time,
      recurring: care.recurring,
      bg: care.bg,
    })

    setEditCareOpen(true)
  }

  const handleSaveEdit = (updated: CareEditData) => {
    updateCare(updated)
    setEditCareOpen(false)
    setCareExpandIdx(null)
  }

  const handleDeleteCare = (id: string) => {
    deleteCare(id)
    setEditCareOpen(false)
    setCareExpandIdx(null)
  }

  const isDayEmpty =
    selectedDayVet.length === 0 &&
    selectedDayMeds.length === 0 &&
    selectedDayVaccines.length === 0 &&
    selectedDayCares.length === 0

  return (
  <>
    {expiredVaccines.length > 0 && (
      <section className="alert-banner">
        <div className="alert-banner__main">
          <div className="alert-banner__title-row">
            <div className="alert-banner__title">🚨 {L.alertsTitle}</div>
            <span className="badge badge-red">
              {expiredVaccines.length} {expiredVaccines.length === 1 ? 'caso' : 'casos'}
            </span>
          </div>

          <div className="alert-banner__list">
            {expiredVaccinesPreview.map((vac) => (
              <div
                key={`${vac.petId}-${vac.name}-${vac.nextDate}`}
                className="alert-banner__item"
              >
                <div className="alert-banner__item-main">
                  <div className="alert-banner__pet">{vac.petEmoji}</div>

                  <div className="alert-banner__item-text">
                    <div className="alert-banner__item-top">
                      <span className="alert-banner__pet-name">{vac.petName}</span>
                      <span className="badge badge-red">{L.vacExpiredTag}</span>
                    </div>

                    <div className="alert-banner__vacc-name">{vac.name}</div>

                    {vac.nextDate && (
                      <div className="alert-banner__meta">
                        {L.vacExpiredSince} {vac.nextDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {expiredVaccinesRemaining > 0 && (
              <div className="alert-banner__item alert-banner__item--more">
                <div className="alert-banner__item-text">
                  <div className="alert-banner__vacc-name">
                    +{expiredVaccinesRemaining} vacuna
                    {expiredVaccinesRemaining > 1 ? 's' : ''} vencida
                    {expiredVaccinesRemaining > 1 ? 's' : ''}
                  </div>
                  <div className="alert-banner__meta">Revisar calendario completo</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="alert-banner__aside">
          <div className="alert-banner__warn">{L.alertsWarn}</div>
        </div>
      </section>
    )}

    <div className="page-header">
      <div>
        <div className="page-title">{L.pageTitle}</div>
        <div className="page-subtitle">{L.pageSubtitle}</div>
      </div>
    </div>

    <div className="cal-toolbar">
      <div className="cal-toolbar-top">
        <div className="cal-toolbar-nav">
          <input
            type="month"
            className="cal-jump"
            value={jumpMonth}
            onChange={(e) => handleJumpChange(e.target.value)}
          />

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
              setJumpMonth(
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`,
              )
              setSelectedDay(todayStr)
            }}
          >
            {L.today}
          </button>
        </div>
      </div>

      <div className="cal-toolbar-bottom">
        <div className="cal-filters">
          <div className="cal-filters-head">
            <div className="cal-filters-label">{L.filterLabel}</div>

            {activeFilters.size > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                {L.clearFilters}
              </button>
            )}
          </div>

          <div className="cal-filters-groups">
            {FILTER_GROUPS.map((group) => (
              <div key={group.id} className="cal-filter-group">
                <div className="cal-filter-group-label">{group.label}</div>

                <div className="cal-filter-group-chips">
                  {group.filters.map((f) => {
                    const isOn = activeFilters.has(f.key)
                    const count = monthCounts[f.key as keyof typeof monthCounts] ?? 0

                    return (
                      <button
                        key={f.key}
                        className="cal-filter-chip"
                        onClick={() => toggleFilter(f.key)}
                        title={isOn ? `Desactivar "${f.label}"` : `Filtrar por "${f.label}"`}
                        style={{
                          borderColor: isOn ? f.color : 'var(--border)',
                          background: isOn ? f.bg : 'var(--surface)',
                          color: isOn ? f.color : 'var(--text-muted)',
                          fontWeight: isOn ? 800 : 700,
                        }}
                      >
                        <span>{f.emoji}</span>
                        <span>{f.label}</span>
                        {count > 0 && <span className="cal-filter-chip__count">{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="cal-layout">
      <div className="cal-grid-wrap">
        <div className="cal-month-header">
          <button
            className="btn btn-secondary btn-sm"
            onClick={prevMonth}
            aria-label={L.monthPrev}
          >
            ‹
          </button>

          <div className="cal-month-label">
            {L.months[month]} {year}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={nextMonth}
            aria-label={L.monthNext}
          >
            ›
          </button>
        </div>

        <div
          className="cal-grid cal-grid--header"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '.55rem' }}
        >
          {L.weekdays.map((wd) => (
            <div key={wd}>{wd}</div>
          ))}
        </div>

        <div
          className="cal-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '.55rem' }}
        >
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="cal-cell cal-cell--dimmed" aria-hidden="true" />
            }

            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = key === todayStr
            const isSelected = key === selectedDay
            const passes = dayPassesFilter(key)
            const dots = getDayDots(key)

            return (
              <button
                key={key}
                className={[
                  'cal-cell',
                  isToday ? 'cal-cell--today' : '',
                  isSelected ? 'cal-cell--selected' : '',
                  !passes ? 'cal-cell--dimmed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedDay(key)}
                aria-label={`${day} ${L.months[month]} ${year}`}
                aria-pressed={isSelected}
              >
                <div className="cal-cell__day">{day}</div>

                {dots.length > 0 && (
                  <div className="cal-dots">
                    {dots.slice(0, 4).map((dot, di) => (
                      <span
                        key={`${dot.key}-${di}`}
                        className="cal-dot"
                        style={{ background: dot.color }}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="cal-detail" ref={detailRef}>
        <div className="cal-detail__date">
          {(() => {
            const [y, m, d] = selectedDay.split('-').map(Number)
            return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
          })()}
        </div>

        {isDayEmpty && <div className="empty">{L.dayEmpty}</div>}

        {selectedDayVet.length > 0 && (
          <div className="cal-detail__section">
            <div className="cal-detail__section-title">{L.dayVetVisits}</div>

            {selectedDayVet.map((ev, idx) => (
              <div key={`${ev.date}-${ev.petId}-${idx}`} className="vet-row">
                <div className="vet-row__icon">{ev.kind === 'past' ? '🩺' : '🔄'}</div>
                <div className="vet-row__info">
                  <div className="vet-row__label">{ev.label}</div>
                  <div className="vet-row__kind">
                    {ev.kind === 'past' ? L.vetVisitKind : L.vetReturnKind}
                  </div>
                </div>
                <span className={`badge ${ev.kind === 'past' ? 'badge-blue' : 'badge-yellow'}`}>
                  {ev.kind === 'past' ? 'Consulta' : 'Retorno'}
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedDayMeds.length > 0 && (
          <div className="cal-detail__section">
            <div className="cal-detail__section-title">{L.dayMedications}</div>

            {selectedDayMeds.map((med) => (
              <div key={med.id} className="med-row">
                <div className="med-row__icon">💊</div>
                <div className="med-row__info">
                  <div className="med-row__name">{med.name}</div>
                  <div className="med-row__pet">
                    {med.petEmoji} {med.petName}
                    {med.dose ? ` · ${med.dose}` : ''}
                    {med.frequency ? ` · ${med.frequency}` : ''}
                  </div>
                </div>
                <span className="badge badge--purple">Medicamento</span>
              </div>
            ))}
          </div>
        )}

        {selectedDayVaccines.length > 0 && (
          <div className="cal-detail__section">
            <div className="cal-detail__section-title">{L.dayVaccines}</div>

            {selectedDayVaccines.map((entry) => {
              const vacc = allVaccines.find((v) => `${v.petId}::${v.name}` === entry.vaccKey)
              if (!vacc) return null

              return (
                <div key={entry.vaccKey} className="vacc-row">
                  <div className="vacc-row__icon">💉</div>
                  <div className="vacc-row__info">
                    <div className="vacc-row__name">{vacc.name}</div>
                    <div className="vacc-row__pet">
                      {vacc.petEmoji} {vacc.petName}
                    </div>
                  </div>

                  {entry.expired ? (
                    <span className="badge badge-red">🚨 {L.vacExpiredTag}</span>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleVaccineApplied(entry.vaccKey, selectedDay)}
                    >
                      💉 {L.vaccineApply}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {selectedDayCares.length > 0 && (
          <div className="cal-detail__section">
            <div className="cal-detail__section-title">{L.dayCares}</div>

            {selectedDayCares.map(({ careId }, listIdx) => {
              const care = careItems.find((c) => c.id === careId)
              if (!care) return null

              const status = getCareStatus(care.doneByDate as DoneByDate, selectedDay)
              const isDone = status === 'done'
              const isSkip = status === 'skip'
              const expanded = careExpandIdx === listIdx

              return (
                <div key={`${careId}-${listIdx}`} className="care-row">
                  <button
                    className="care-row__header"
                    onClick={() => setCareExpandIdx(expanded ? null : listIdx)}
                  >
                    <div style={{ fontSize: '1.3rem' }}>{care.emoji}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="care-title">{care.title}</div>
                      {care.sub && <div className="care-sub">{care.sub}</div>}
                    </div>

                    {isDone && <span className="badge badge-green">✓ {L.careDone}</span>}
                    {isSkip && <span className="badge badge-gray">{L.careSkipped}</span>}
                    {!isDone && !isSkip && <span className="badge badge-yellow">{L.carePending}</span>}
                  </button>

                  {expanded && (
                    <div className="care-row__actions">
                      {!isDone && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setCareProgress(careId, selectedDay, care.total, true)}
                        >
                          ✓ {L.careDone}
                        </button>
                      )}

                      {isDone && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setCareProgress(careId, selectedDay, 0, false)}
                        >
                          ↺ {L.carePending}
                        </button>
                      )}

                      {!isSkip && !isDone && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setCareProgress(careId, selectedDay, 0, false)}
                        >
                          {L.careSkipped}
                        </button>
                      )}

                      <button className="btn btn-ghost btn-sm" onClick={() => openEditCare(careId)}>
                        ✏️ {L.editCare}
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>

    <EditCareModal
      isOpen={editCareOpen}
      onClose={() => {
        setEditCareOpen(false)
        setCareExpandIdx(null)
      }}
      care={editCareItem}
      onSave={handleSaveEdit}
      onDelete={handleDeleteCare}
    />
  </>)}
