import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MOCK_PETS, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import BackButton from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const HARDCODED_MEDS = [
  { date:'2026-04-30', petId:'pet-2', label:'Pipeta antipulgas' },
  { date:'2026-07-10', petId:'pet-1', label:'Bravecto'          },
]

const WEEKDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const pad = (n: number) => String(n).padStart(2, '0')
const buildDateStr = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`

interface CalEvent {
  type:    'vaccine' | 'medication'
  petId:   string
  petName: string
  petEmoji:string
  label:   string
  status:  'ok' | 'soon' | 'late'
  color:   string
  bgColor: string
}

type FilterType = 'all' | 'late' | 'soon' | 'ok' | 'medication'

const STATUS_COLOR = {
  late:       'var(--err)',
  soon:       '#d48e00',
  ok:         'var(--success)',
  medication: 'var(--blue)',
}
const STATUS_BG = {
  late:       'var(--err-hl)',
  soon:       '#fff8d6',
  ok:         'var(--success-hl)',
  medication: 'var(--blue-hl)',
}

export default function CalendarPage() {
  const location    = useLocation()
  const initialDate = (location.state as { initialDate?:string } | null)?.initialDate

  const today    = new Date()
  const todayStr = buildDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewMonth,   setViewMonth]   = useState(() => {
    if (initialDate) {
      const [y,m] = initialDate.split('-').map(Number)
      return new Date(y, m-1, 1)
    }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDate ?? null)
  const [filter,      setFilter]      = useState<FilterType>('all')
  const [jumpMonth,   setJumpMonth]   = useState(() => {
    const d = viewMonth
    return `${d.getFullYear()}-${pad(d.getMonth())}`
  })

  useEffect(() => {
    setJumpMonth(`${viewMonth.getFullYear()}-${pad(viewMonth.getMonth())}`)
  }, [viewMonth])

  useEffect(() => {
    if (initialDate) {
      const [y,m] = initialDate.split('-').map(Number)
      setViewMonth(new Date(y, m-1, 1))
      setSelectedDay(initialDate)
    }
  }, [initialDate])

  const { eventMap, overdueEvents } = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    const overdue: CalEvent[] = []
    const add = (ds: string, ev: CalEvent) => {
      if (!map[ds]) map[ds] = []
      map[ds].push(ev)
    }
    for (const pet of MOCK_PETS) {
      const allV: VaccineRecord[] = [...(VACCINES_BY_PET[pet.id] ?? [])]
      for (const v of allV) {
        if (!v.nextDate) continue
        const status = getVaccStatus(v.nextDate) as 'ok'|'soon'|'late'
        const color   = STATUS_COLOR[status]
        const bgColor = STATUS_BG[status]
        const ev: CalEvent = { type:'vaccine', petId:pet.id, petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:v.name, status, color, bgColor }
        add(v.nextDate, ev)
        if (status === 'late') overdue.push({ ...ev })
      }
    }
    for (const med of HARDCODED_MEDS) {
      const pet = MOCK_PETS.find(p => p.id === med.petId); if (!pet) continue
      const ev: CalEvent = { type:'medication', petId:pet.id, petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:med.label, status:'ok', color:STATUS_COLOR.medication, bgColor:STATUS_BG.medication }
      add(med.date, ev)
    }
    return { eventMap: map, overdueEvents: overdue }
  }, [])

  const filteredMap = useMemo(() => {
    if (filter === 'all') return eventMap
    return Object.fromEntries(
      Object.entries(eventMap).map(([d, evts]) => [
        d,
        evts.filter((e: CalEvent) => {
          if (filter === 'late')       return e.status === 'late'
          if (filter === 'soon')       return e.status === 'soon'
          if (filter === 'ok')         return e.status === 'ok' && e.type === 'vaccine'
          if (filter === 'medication') return e.type === 'medication'
          return true
        }),
      ]).filter(([, evts]) => (evts as CalEvent[]).length > 0)
    )
  }, [eventMap, filter])

  const cells = useMemo(() => {
    const year     = viewMonth.getFullYear()
    const month    = viewMonth.getMonth()
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7
    const days     = new Date(year, month+1, 0).getDate()
    const result: (null | { d:number; dateStr:string })[] = []
    for (let i=0; i<firstDow; i++) result.push(null)
    for (let d=1; d<=days; d++) result.push({ d, dateStr: buildDateStr(year, month, d) })
    return result
  }, [viewMonth])

  const selectedEvents: CalEvent[] = selectedDay ? ((filteredMap[selectedDay] ?? []) as CalEvent[]) : []

  const handleJumpChange = (val: string) => {
    setJumpMonth(val)
    if (val.length >= 7) {
      const [y, m] = val.split('-').map(Number)
      if (y >= 2020 && y <= 2040 && m >= 0 && m <= 11) {
        setViewMonth(new Date(y, m, 1))
      }
    }
  }

  const FILTERS: { val: FilterType; label: string; color: string }[] = [
    { val:'all',        label:'Todos',       color:'var(--text-muted)'      },
    { val:'late',       label:'Vencidas',    color:STATUS_COLOR.late        },
    { val:'soon',       label:'Pronto (30d)',color:STATUS_COLOR.soon        },
    { val:'ok',         label:'Al día',      color:STATUS_COLOR.ok          },
    { val:'medication', label:'Medicamentos',color:STATUS_COLOR.medication  },
  ]

  return (
    <div>
      <BackButton label="Volver"/>

      <div className="page-header">
        <div>
          <div className="page-title">Calendario</div>
          <div className="page-subtitle">Todos los eventos de salud de tus mascotas</div>
        </div>
      </div>

      {overdueEvents.length > 0 && (
        <div className="cal-overdue-banner" onClick={() => setFilter((f: FilterType) => f==='late'?'all':'late')}>
          <div style={{ width:36, height:36, borderRadius:'var(--r-lg)', background:'var(--err)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>⚠</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:'.9rem', color:'var(--err)' }}>
              {overdueEvents.length} evento{overdueEvents.length!==1?'s':''} vencido{overdueEvents.length!==1?'s':''}
            </div>
            <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginTop:'.1rem' }}>
              {overdueEvents.map((e: CalEvent) => `${e.petEmoji} ${e.label}`).join(' · ')}
            </div>
          </div>
          <span className="badge badge-red">{filter==='late'?'✕ Quitar filtro':'Ver todos'}</span>
        </div>
      )}

      <div className="cal-page-toolbar">
        <div className="cal-date-jump">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <input type="month" value={jumpMonth} onChange={e => handleJumpChange(e.target.value)}/>
        </div>

        <button className="vacc-cal-today-btn" onClick={() => { setViewMonth(new Date(today.getFullYear(),today.getMonth(),1)); setSelectedDay(todayStr) }}>
          Hoy
        </button>

        <div className="cal-filter-pills">
          {FILTERS.map((f: { val: FilterType; label: string; color: string }) => (
            <button key={f.val} className={`cal-filter-pill ${filter===f.val?'active':''}`}
              onClick={() => setFilter(f.val)}>
              {f.val !== 'all' && <span className="cal-dot-filter" style={{ background: f.color }}/>}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="vacc-cal" style={{ maxWidth:'100%' }}>
        <div className="vacc-cal-header">
          <button className="vacc-cal-nav" onClick={() => setViewMonth((m: Date) => new Date(m.getFullYear(),m.getMonth()-1,1))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="vacc-cal-month-title">{MONTHS_ES[viewMonth.getMonth()]} {viewMonth.getFullYear()}</div>
          <button className="vacc-cal-nav" onClick={() => setViewMonth((m: Date) => new Date(m.getFullYear(),m.getMonth()+1,1))}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="vacc-cal-weekdays">{WEEKDAYS.map((d: string) => <div key={d} className="vacc-cal-wd">{d}</div>)}</div>

        <div className="vacc-cal-grid">
          {cells.map((cell, i: number) => {
            if (!cell) return <div key={`p${i}`} className="vacc-cal-pad"/>
            const evts    = (filteredMap[cell.dateStr] ?? []) as CalEvent[]
            const isToday = cell.dateStr === todayStr
            const isSel   = cell.dateStr === selectedDay
            return (
              <div key={cell.dateStr}
                className={['vacc-cal-day', isToday?'is-today':'', isSel?'is-selected':'', evts.length>0?'has-events':''].join(' ')}
                onClick={() => setSelectedDay(isSel?null:cell.dateStr)}>
                <span className={['vacc-cal-day-num', isToday?'today-circle':''].join(' ')}>{cell.d}</span>
                {evts.length > 0 && (
                  <div className="vacc-cal-dots">
                    {evts.slice(0,4).map((e: CalEvent, j: number) => <span key={j} className="vacc-cal-dot" style={{ background:e.color }}/>)}
                    {evts.length>4 && <span style={{ fontSize:'.5rem',color:'var(--text-faint)',fontWeight:800 }}>+{evts.length-4}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="vacc-cal-legend">
          {[
            { color:STATUS_COLOR.late,       label:'Vencida'      },
            { color:STATUS_COLOR.soon,       label:'Vence pronto' },
            { color:STATUS_COLOR.ok,         label:'Al día'       },
            { color:STATUS_COLOR.medication, label:'Medicamento'  },
          ].map((l: { color: string; label: string }) => (
            <div key={l.label} className="vacc-cal-legend-item">
              <span className="vacc-cal-dot" style={{ background:l.color, width:8, height:8 }}/>{l.label}
            </div>
          ))}
        </div>

        {selectedDay && (
          <div className="vacc-cal-panel">
            <div className="vacc-cal-panel-header">
              <span className="vacc-cal-panel-date">
                {new Date(selectedDay+'T12:00:00').toLocaleDateString('es-ES',{ weekday:'long', day:'numeric', month:'long' })}
              </span>
              <button className="vacc-cal-panel-close" onClick={() => setSelectedDay(null)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {selectedEvents.length === 0
              ? <div style={{ padding:'1.25rem', textAlign:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>Sin eventos este día ✓</div>
              : <div className="vacc-cal-event-list">
                  {selectedEvents.map((ev: CalEvent, i: number) => (
                    <div key={i} className="vacc-cal-event-row">
                      <div className="vacc-cal-event-type-dot" style={{ background:ev.color }}/>
                      <div className="vacc-cal-event-icon" style={{ background:ev.bgColor }}>
                        {ev.type==='vaccine'?'💉':'💊'}
                      </div>
                      <div style={{ flex:1 }}>
                        <div className="vacc-cal-event-label">{ev.label}</div>
                        <div className="vacc-cal-event-pet">{ev.petEmoji} {ev.petName}</div>
                      </div>
                      <span className="badge" style={{ background:ev.bgColor, color:ev.color, fontSize:'.65rem', border:`1px solid ${ev.color}33` }}>
                        {ev.type==='vaccine'
                          ? ev.status==='late'?'Vencida':ev.status==='soon'?'Pronto':'Al día'
                          : 'Med.'}
                      </span>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}
