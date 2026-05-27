// traduzido e sem mock

import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getVaccStatus } from '../utils/vaccUtils'
import type { VaccineRecord } from '../utils/vaccUtils'
import { RegisterVaccineModal } from './PetDetailPage'
import VaccRing from '../components/VaccRing'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import BackButton from '../components/BackButton'
import { useVaccines } from '../context/VaccinesContext'
import type { VaccineWithMeta } from '../context/VaccinesContext'  // ← importa tipo do contexto
import { usePetsContext } from '../context/PetsContext'

const PET_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

const pad = (n: number) => String(n).padStart(2, '0')
const buildDateStr = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`

const STATUS_COLOR = {
  late: 'var(--err)',
  soon: '#d48e00',
  ok:   'var(--success)',
  med:  'var(--blue)',
}
const STATUS_BG = {
  late: 'var(--err-hl)',
  soon: '#fff8d6',
  ok:   'var(--success-hl)',
  med:  'var(--blue-hl)',
}

interface CalEvent {
  type:    'vaccine' | 'medication'
  petName: string; petEmoji: string; label: string
  status:  'ok' | 'soon' | 'late'; color: string; bgColor: string; careId?: string
}

const eventColor = (s: 'ok'|'soon'|'late') => s==='late' ? STATUS_COLOR.late : s==='soon' ? STATUS_COLOR.soon : STATUS_COLOR.ok
const eventBg    = (s: 'ok'|'soon'|'late') => s==='late' ? STATUS_BG.late   : s==='soon' ? STATUS_BG.soon   : STATUS_BG.ok

function PencilIcon({ size=13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}


// ── VaccinesCalendar ──────────────────────────────────────────────

function VaccinesCalendar({ allVaccines, initialDate, meds }: {
  allVaccines: VaccineWithMeta[]
  initialDate?: string
  meds: { date: string; petId: string; label: string }[]
}) {
  const { t }    = useTranslation()
  const { pets } = usePetsContext()

  const WEEKDAYS_SHORT = t('dates.weekdaysShort', { returnObjects: true }) as string[]
  const WEEKDAYS = [...WEEKDAYS_SHORT.slice(1), WEEKDAYS_SHORT[0]]
  const MONTHS   = t('dates.months', { returnObjects: true }) as string[]

  const today    = new Date()
  const todayStr = buildDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewMonth,   setViewMonth]   = useState(() => {
    if (initialDate) { const [y,m] = initialDate.split('-').map(Number); return new Date(y,m-1,1) }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string|null>(initialDate ?? null)

  useEffect(() => {
    if (initialDate) {
      const [y,m] = initialDate.split('-').map(Number)
      setViewMonth(new Date(y,m-1,1)); setSelectedDay(initialDate)
    }
  }, [initialDate])

  const eventMap = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    const add = (ds: string, ev: CalEvent) => { if (!map[ds]) map[ds] = []; map[ds].push(ev) }
    for (const v of allVaccines) {
      if (!v.nextDate) continue
      add(v.nextDate, { type:'vaccine', petName:v.petName, petEmoji:v.petEmoji, label:v.name, status:v.cls, color:eventColor(v.cls), bgColor:eventBg(v.cls) })
    }
    for (const m of meds) {
      const pet = pets.find(p => p.id === m.petId); if (!pet) continue
      add(m.date, { type:'medication', petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:m.label, status:'ok', color:STATUS_COLOR.med, bgColor:STATUS_BG.med })
    }
    return map
  }, [allVaccines, meds, pets])

  const cells = useMemo(() => {
    const year = viewMonth.getFullYear(), month = viewMonth.getMonth()
    const firstDow = (new Date(year,month,1).getDay()+6)%7
    const days = new Date(year,month+1,0).getDate()
    const result: (null|{ d: number; dateStr: string })[] = []
    for (let i = 0; i < firstDow; i++) result.push(null)
    for (let d = 1; d <= days; d++) result.push({ d, dateStr: buildDateStr(year,month,d) })
    return result
  }, [viewMonth])

  const selectedEvents = selectedDay ? (eventMap[selectedDay] ?? []) : []

  const legendItems = [
    { color: STATUS_COLOR.late, label: t('vaccines.expired')      },
    { color: STATUS_COLOR.soon, label: t('vaccines.expiringSoon') },
    { color: STATUS_COLOR.ok,   label: t('vaccines.upToDate')     },
    { color: STATUS_COLOR.med,  label: t('calendar.medication')   },
  ]

  return (
    <div className="vacc-cal">
      <div className="vacc-cal-header">
        <button className="vacc-cal-nav" onClick={() => setViewMonth(m => new Date(m.getFullYear(),m.getMonth()-1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="vacc-cal-month-title">{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</div>
        <button className="vacc-cal-nav" onClick={() => setViewMonth(m => new Date(m.getFullYear(),m.getMonth()+1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button className="vacc-cal-today-btn" onClick={() => { setViewMonth(new Date(today.getFullYear(),today.getMonth(),1)); setSelectedDay(todayStr) }}>
          {t('calendar.today')}
        </button>
      </div>

      <div className="vacc-cal-weekdays">
        {WEEKDAYS.map(d => <div key={d} className="vacc-cal-wd">{d}</div>)}
      </div>

      <div className="vacc-cal-grid">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`p${i}`} className="vacc-cal-pad"/>
          const evts = eventMap[cell.dateStr] ?? []
          const isToday = cell.dateStr === todayStr
          const isSel   = cell.dateStr === selectedDay
          return (
            <div key={cell.dateStr}
              className={['vacc-cal-day', isToday?'is-today':'', isSel?'is-selected':'', evts.length>0?'has-events':''].join(' ')}
              onClick={() => setSelectedDay(isSel ? null : cell.dateStr)}>
              <span className={['vacc-cal-day-num', isToday?'today-circle':''].join(' ')}>{cell.d}</span>
              {evts.length > 0 && (
                <div className="vacc-cal-dots">
                  {evts.slice(0,4).map((e,j) => <span key={j} className="vacc-cal-dot" style={{ background:e.color }}/>)}
                  {evts.length > 4 && <span style={{ fontSize:'.5rem', color:'var(--text-faint)', fontWeight:800 }}>+{evts.length-4}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="vacc-cal-legend">
        {legendItems.map(l => (
          <div key={l.label} className="vacc-cal-legend-item">
            <span className="vacc-cal-dot" style={{ background:l.color, width:8, height:8 }}/>{l.label}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="vacc-cal-panel">
          <div className="vacc-cal-panel-header">
            <span className="vacc-cal-panel-date">
              {new Date(selectedDay+'T12:00:00').toLocaleDateString(t('dates.locale'), { weekday:'long', day:'numeric', month:'long' })}
            </span>
            <button className="vacc-cal-panel-close" onClick={() => setSelectedDay(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {selectedEvents.length === 0
            ? <div style={{ padding:'1.25rem', textAlign:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>
                {t('calendar.dayEmpty')} ✓
              </div>
            : <div className="vacc-cal-event-list">
                {selectedEvents.map((ev,i) => (
                  <div key={i} className="vacc-cal-event-row">
                    <div className="vacc-cal-event-type-dot" style={{ background:ev.color }}/>
                    <div className="vacc-cal-event-icon" style={{ background:ev.bgColor }}>{ev.type==='vaccine'?'💉':'💊'}</div>
                    <div style={{ flex:1 }}>
                      <div className="vacc-cal-event-label">{ev.label}</div>
                      <div className="vacc-cal-event-pet">{ev.petEmoji} {ev.petName}</div>
                    </div>
                    <span className="badge" style={{ background:ev.bgColor, color:ev.color, fontSize:'.65rem', border:`1px solid ${ev.color}44` }}>
                      {ev.type === 'vaccine'
                        ? (ev.status==='late' ? t('vaccines.expired') : ev.status==='soon' ? t('vaccines.expiringSoon') : t('vaccines.upToDate'))
                        : t('calendar.medication')}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>
      )}
    </div>
  )
}


// ── VaccinesPage ──────────────────────────────────────────────────

export default function VaccinesPage() {
  const { t }       = useTranslation()
  const location    = useLocation()
  const { pets, loading: petsLoading } = usePetsContext()
  const { vaccinesByPet, allVaccines: allVaccinesForCalendar, addVaccine, updateVaccine } = useVaccines()
  const initialDate = (location.state as { initialDate?: string }|null)?.initialDate

  const VACC_BADGE = {
    ok:   { badge: t('pet.vacc.badgeOk'),   cls: 'badge-green'  },
    soon: { badge: t('pet.vacc.badgeSoon'), cls: 'badge-yellow' },
    late: { badge: t('pet.vacc.badgeLate'), cls: 'badge-red'    },
  }

  // ✅ FIX: inicialização segura — não acede a pets[0] diretamente
  const [selectedPetId, setSelectedPetId] = useState('')
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [detailVaccine, setDetailVaccine] = useState<(VaccineRecord & { cls:'ok'|'soon'|'late'; petName:string; petEmoji:string })|null>(null)
  const [editVaccine,   setEditVaccine]   = useState<VaccineRecord|null>(null)
  const [editOpen,      setEditOpen]      = useState(false)

  // ✅ FIX: inicializar quando pets carregam (espera loading terminar)
  useEffect(() => {
    if (!petsLoading && pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0]?.id ?? '')
    }
  }, [pets, petsLoading, selectedPetId])

  // ✅ FIX: sincronizar quando o pet selecionado é deletado
  useEffect(() => {
    if (selectedPetId && !pets.find(p => p.id === selectedPetId)) {
      setSelectedPetId(pets[0]?.id ?? '')
    }
  }, [pets, selectedPetId])

  const getVacc    = (petId: string) => vaccinesByPet[petId] ?? []

  // ✅ FIX: sem fallback para pets[0] — usa null se não encontrar
  const pet        = pets.find(p => p.id === selectedPetId) ?? null
  const vaccines   = pet ? getVacc(pet.id) : []
  const withStatus = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok'|'soon'|'late' }))

  const meds: { date: string; petId: string; label: string }[] = []

  const okCount = withStatus.filter(v => v.cls==='ok').length
  const alDia   = withStatus.filter(v => v.cls==='ok' || v.cls==='soon').length
  const pending = withStatus.filter(v => v.cls==='soon' || v.cls==='late').length
  const total   = vaccines.length
  const cov     = total > 0 ? Math.round(okCount/total*100) : 100
  const alPct   = total > 0 ? Math.round(alDia/total*100)  : 100
  const penPct  = total > 0 ? Math.round(pending/total*100): 0

  const handleRegister = ({ name, date, nextDate }: { name:string; date:string; nextDate:string; vet:string; notes:string }) => {
    const cls = getVaccStatus(nextDate) as 'ok'|'soon'|'late'
    addVaccine(selectedPetId, {
      name,
      applied:  new Date(date+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' }),
      nextDate,
      badge:    VACC_BADGE[cls].badge,
      badgeCls: VACC_BADGE[cls].cls,
    })
  }

  const handleOpenDetail = (v: VaccineRecord & { cls:'ok'|'soon'|'late' }) =>
    setDetailVaccine({ ...v, petName: pet?.name ?? '', petEmoji: PET_EMOJI[pet?.species ?? ''] ?? '🐾' })

  const handleSaveVaccine = (updated: VaccineRecord) => {
    updateVaccine(selectedPetId, updated)
  }

  const handleMarkApplied = (v: VaccineRecord, appliedDate: string, nextDate: string) => {
    const cls = getVaccStatus(nextDate) as 'ok'|'soon'|'late'
    handleSaveVaccine({
      ...v,
      applied:  new Date(appliedDate+'T12:00:00').toLocaleDateString(t('dates.locale'), { day:'2-digit', month:'short', year:'numeric' }),
      nextDate,
      badge:    VACC_BADGE[cls].badge,
      badgeCls: VACC_BADGE[cls].cls,
    })
  }

  const coverageBars = [
    { label: t('vaccines.coverage'),    pct: cov,   color: ''                                  },
    { label: t('vaccines.upToDate'),    pct: alPct, color: 'success'                           },
    { label: `${t('vaccines.expiringSoon')} / ${t('vaccines.expired')}`, pct: penPct, color: penPct>0?'warn':'success' },
  ]

  // ✅ FIX: guard para loading
  if (petsLoading) return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('vaccines.title')}</div>
          <div className="page-subtitle">{t('vaccines.subtitle')}</div>
        </div>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>{t('common.loading')}</div>
      </div>
    </div>
  )

  // ✅ FIX: guard para pets vazio
  if (!pets.length) return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('vaccines.title')}</div>
          <div className="page-subtitle">{t('vaccines.subtitle')}</div>
        </div>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💉</div>
        <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '.375rem' }}>
          {t('pets.noPets')}
        </div>
        <div style={{ fontSize: '.875rem', color: 'var(--text-muted)' }}>
          {t('pets.noPetsHint')}
        </div>
      </div>
    </div>
  )

  // ✅ FIX: guard para pet não encontrado (ex: ainda a sincronizar)
  if (!pet) return null

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('vaccines.title')}</div>
          <div className="page-subtitle">{t('vaccines.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
          💉 {t('vaccines.register')}
        </button>
      </div>

      <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {pets.map(p => (
          <button key={p.id}
            className={['btn', selectedPetId===p.id ? 'btn-primary' : 'btn-secondary'].join(' ')}
            onClick={() => setSelectedPetId(p.id)}>
            {PET_EMOJI[p.species] ?? '🐾'} {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            {t('pet.vacc.title')} {pet.name}
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>
              💉 {t('pet.vacc.registerBtn')}
            </button>
          </div>
          {withStatus.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
                {t('vaccines.noVaccines')}
              </div>
            : withStatus.map(v => (
                <div key={v.name+v.nextDate}
                  style={{ display:'flex', alignItems:'center', gap:'.875rem', padding:'.75rem 0', borderBottom:'1.5px solid var(--divider)', cursor:'pointer' }}
                  onClick={() => handleOpenDetail(v)}>
                  <div className="vaccine-icon" style={{ background:eventBg(v.cls), color:eventColor(v.cls) }}>💉</div>
                  <div style={{ flex:1 }}>
                    <div className="vaccine-name">{v.name}</div>
                    <div className="vaccine-date">{t('pet.vacc.applied')} {v.applied}</div>
                  </div>
                  <div style={{ textAlign:'right', marginRight:'.5rem' }}>
                    <div className="vaccine-next" style={{ color:eventColor(v.cls) }}>
                      {v.cls === 'late'
                        ? `${t('pet.vacc.expired')} · ${new Date(v.nextDate+'T12:00:00').toLocaleDateString(t('dates.locale'))}`
                        : `${t('pet.vacc.next')} ${new Date(v.nextDate+'T12:00:00').toLocaleDateString(t('dates.locale'))}`}
                    </div>
                    <span className="badge" style={{ background:eventBg(v.cls), color:eventColor(v.cls), fontSize:'.6rem' }}>{v.badge}</span>
                  </div>
                </div>
              ))
          }
        </div>

        <div className="card">
          <div className="card-title">{t('pet.vacc.coverage')} {pet.name}</div>
          <div style={{ display:'flex', justifyContent:'center', margin:'1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8}/>
          </div>
          {coverageBars.map(b => (
            <div key={b.label} style={{ marginBottom:'.875rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'.375rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontWeight:700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap">
                <div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div>
            <div className="page-title" style={{ fontSize:'1.125rem' }}>{t('calendar.title')}</div>
            <div className="page-subtitle">{t('vaccines.calSubtitle')}</div>
          </div>
        </div>
        <VaccinesCalendar
          allVaccines={allVaccinesForCalendar}
          initialDate={initialDate}
          meds={meds}
        />
      </div>

      <RegisterVaccineModal petName={pet.name} isOpen={registerOpen} onClose={() => setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister}/>
      <VaccineDetailModal vaccine={detailVaccine} onClose={() => setDetailVaccine(null)} onEdit={v => { setEditVaccine(v); setEditOpen(true) }} onMarkApplied={handleMarkApplied}/>
      <EditVaccineModal isOpen={editOpen} onClose={() => setEditOpen(false)} vaccine={editVaccine} onSave={v => { handleSaveVaccine(v); setEditOpen(false) }}/>
    </div>
  )
}
