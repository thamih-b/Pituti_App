import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MOCK_PETS, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { RegisterVaccineModal } from './PetDetailPage'
import VaccRing from '../components/VaccRing'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import BackButton from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

// ── Fixed date builder — avoids UTC timezone shifts ───────────────
const pad = (n: number) => String(n).padStart(2, '0')
const buildDateStr = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`

// ── "Vence pronto" is now amber/yellow ───────────────────────────
const STATUS_COLOR = {
  late: 'var(--err)',
  soon: '#d48e00',    // amber, clearly yellow-toned
  ok:   'var(--success)',
  med:  'var(--blue)',
}
const STATUS_BG = {
  late: 'var(--err-hl)',
  soon: '#fff8d6',
  ok:   'var(--success-hl)',
  med:  'var(--blue-hl)',
}

const HARDCODED_MEDS = [
  { date:'2026-04-30', petId:'pet-2', label:'Pipeta antipulgas' },
  { date:'2026-07-10', petId:'pet-1', label:'Bravecto'          },
]

const WEEKDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface CalEvent {
  type:    'vaccine'|'medication'
  petName: string; petEmoji: string; label: string
  status:  'ok'|'soon'|'late'; color: string; bgColor: string
}

type VaccineWithMeta = VaccineRecord & { cls:'ok'|'soon'|'late'; petName:string; petEmoji:string; petId:string }

// ── Build color given status ──────────────────────────────────────
const eventColor  = (s: 'ok'|'soon'|'late') => s==='late'?STATUS_COLOR.late:s==='soon'?STATUS_COLOR.soon:STATUS_COLOR.ok
const eventBg     = (s: 'ok'|'soon'|'late') => s==='late'?STATUS_BG.late  :s==='soon'?STATUS_BG.soon  :STATUS_BG.ok

function VaccinesCalendar({ allVaccines, extraVacc, initialDate }: {
  allVaccines: VaccineWithMeta[]
  extraVacc: Record<string,VaccineRecord[]>
  initialDate?: string
}) {
  const today    = new Date()
  const todayStr = buildDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewMonth,   setViewMonth]   = useState(() => {
    if (initialDate) { const [y,m]=initialDate.split('-').map(Number); return new Date(y,m-1,1) }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string|null>(initialDate??null)

  useEffect(() => {
    if (initialDate) {
      const [y,m] = initialDate.split('-').map(Number)
      setViewMonth(new Date(y,m-1,1)); setSelectedDay(initialDate)
    }
  }, [initialDate])

  const eventMap = useMemo(() => {
    const map: Record<string,CalEvent[]> = {}
    const add = (ds:string, ev:CalEvent) => { if(!map[ds]) map[ds]=[]; map[ds].push(ev) }
    for (const v of allVaccines) {
      if (!v.nextDate) continue
      add(v.nextDate, { type:'vaccine', petName:v.petName, petEmoji:v.petEmoji, label:v.name, status:v.cls, color:eventColor(v.cls), bgColor:eventBg(v.cls) })
    }
    for (const m of HARDCODED_MEDS) {
      const pet=MOCK_PETS.find(p=>p.id===m.petId); if(!pet) continue
      add(m.date, { type:'medication', petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:m.label, status:'ok', color:STATUS_COLOR.med, bgColor:STATUS_BG.med })
    }
    return map
  }, [allVaccines])

  const cells = useMemo(() => {
    const year=viewMonth.getFullYear(), month=viewMonth.getMonth()
    const firstDow=(new Date(year,month,1).getDay()+6)%7
    const days=new Date(year,month+1,0).getDate()
    const result:(null|{d:number;dateStr:string})[] = []
    for(let i=0;i<firstDow;i++) result.push(null)
    for(let d=1;d<=days;d++) result.push({ d, dateStr:buildDateStr(year,month,d) })
    return result
  }, [viewMonth])

  const selectedEvents = selectedDay ? (eventMap[selectedDay]??[]) : []

  return (
    <div className="vacc-cal">
      <div className="vacc-cal-header">
        <button className="vacc-cal-nav" onClick={()=>setViewMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="vacc-cal-month-title">{MONTHS_ES[viewMonth.getMonth()]} {viewMonth.getFullYear()}</div>
        <button className="vacc-cal-nav" onClick={()=>setViewMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button className="vacc-cal-today-btn" onClick={()=>{setViewMonth(new Date(today.getFullYear(),today.getMonth(),1));setSelectedDay(todayStr)}}>Hoy</button>
      </div>

      <div className="vacc-cal-weekdays">{WEEKDAYS.map(d=><div key={d} className="vacc-cal-wd">{d}</div>)}</div>

      <div className="vacc-cal-grid">
        {cells.map((cell,i) => {
          if (!cell) return <div key={`p${i}`} className="vacc-cal-pad"/>
          const evts=eventMap[cell.dateStr]??[]; const isToday=cell.dateStr===todayStr; const isSel=cell.dateStr===selectedDay
          return (
            <div key={cell.dateStr}
              className={['vacc-cal-day',isToday?'is-today':'',isSel?'is-selected':'',evts.length>0?'has-events':''].join(' ')}
              onClick={()=>setSelectedDay(isSel?null:cell.dateStr)}>
              <span className={['vacc-cal-day-num',isToday?'today-circle':''].join(' ')}>{cell.d}</span>
              {evts.length>0 && (
                <div className="vacc-cal-dots">
                  {evts.slice(0,4).map((e,j)=><span key={j} className="vacc-cal-dot" style={{ background:e.color }}/>)}
                  {evts.length>4&&<span style={{ fontSize:'.5rem',color:'var(--text-faint)',fontWeight:800 }}>+{evts.length-4}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend with yellow for soon */}
      <div className="vacc-cal-legend">
        {[
          { color:STATUS_COLOR.late, label:'Vencida / Urgente'  },
          { color:STATUS_COLOR.soon, label:'Vence pronto (30d)' },
          { color:STATUS_COLOR.ok,   label:'Al día'             },
          { color:STATUS_COLOR.med,  label:'Medicamento'        },
        ].map(l=>(
          <div key={l.label} className="vacc-cal-legend-item">
            <span className="vacc-cal-dot" style={{ background:l.color,width:8,height:8 }}/>{l.label}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="vacc-cal-panel">
          <div className="vacc-cal-panel-header">
            <span className="vacc-cal-panel-date">
              {new Date(selectedDay+'T12:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
            </span>
            <button className="vacc-cal-panel-close" onClick={()=>setSelectedDay(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {selectedEvents.length===0
            ?<div style={{ padding:'1.25rem',textAlign:'center',color:'var(--text-faint)',fontSize:'.875rem' }}>Sin eventos este día ✓</div>
            :<div className="vacc-cal-event-list">
              {selectedEvents.map((ev,i)=>(
                <div key={i} className="vacc-cal-event-row">
                  <div className="vacc-cal-event-type-dot" style={{ background:ev.color }}/>
                  <div className="vacc-cal-event-icon" style={{ background:ev.bgColor }}>{ev.type==='vaccine'?'💉':'💊'}</div>
                  <div style={{ flex:1 }}><div className="vacc-cal-event-label">{ev.label}</div><div className="vacc-cal-event-pet">{ev.petEmoji} {ev.petName}</div></div>
                  <span className="badge" style={{ background:ev.bgColor, color:ev.color, fontSize:'.65rem', border:`1px solid ${ev.color}44` }}>
                    {ev.type==='vaccine'?(ev.status==='late'?'Vencida':ev.status==='soon'?'Pronto':'Al día'):'Med.'}
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

function PencilIcon({ size=13 }: { size?:number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}

export default function VaccinesPage() {
  const location    = useLocation()
  const initialDate = (location.state as {initialDate?:string}|null)?.initialDate

  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0].id)
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [extraVacc,     setExtraVacc]     = useState<Record<string,VaccineRecord[]>>({})
  const [detailVaccine, setDetailVaccine] = useState<(VaccineRecord&{cls:'ok'|'soon'|'late';petName:string;petEmoji:string})|null>(null)
  const [editVaccine,   setEditVaccine]   = useState<VaccineRecord|null>(null)
  const [editOpen,      setEditOpen]      = useState(false)

  const getVacc = (petId:string) => [...(VACCINES_BY_PET[petId]??[]), ...(extraVacc[petId]??[])]
  const pet        = MOCK_PETS.find(p=>p.id===selectedPetId)??MOCK_PETS[0]
  const vaccines   = getVacc(selectedPetId)
  const withStatus = vaccines.map(v=>({...v, cls:getVaccStatus(v.nextDate) as 'ok'|'soon'|'late'}))

  // ALL pets vaccines for calendar — this is what fixes Toby's antirrábica visibility
  const allVaccinesForCalendar: VaccineWithMeta[] = MOCK_PETS.flatMap(p =>
    getVacc(p.id).map(v => ({
      ...v,
      cls:      getVaccStatus(v.nextDate) as 'ok'|'soon'|'late',
      petName:  p.name,
      petEmoji: PET_EMOJI[p.species]??'🐾',
      petId:    p.id,
    }))
  )

  const okCount   = withStatus.filter(v=>v.cls==='ok').length
  const alDia     = withStatus.filter(v=>v.cls==='ok'||v.cls==='soon').length
  const pending   = withStatus.filter(v=>v.cls==='soon'||v.cls==='late').length
  const total     = vaccines.length
  const cov       = total>0?Math.round(okCount/total*100):100
  const alPct     = total>0?Math.round(alDia/total*100):100
  const penPct    = total>0?Math.round(pending/total*100):0

  const handleRegister = ({name,date,nextDate}:{name:string;date:string;nextDate:string;vet:string;notes:string}) => {
    const lbl = new Date(nextDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    const cls = getVaccStatus(nextDate)
    setExtraVacc(prev => ({
      ...prev,
      [selectedPetId]: [...(prev[selectedPetId]??[]), {
        name, applied:new Date(date+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'}),
        nextDate,
        badge:    cls==='ok'?'AL DÍA':cls==='soon'?'POR VENCER':'VENCIDA',
        badgeCls: cls==='ok'?'badge-green':cls==='soon'?'badge-yellow':'badge-red',
      }],
    }))
  }

  const handleOpenDetail = (v: VaccineRecord&{cls:'ok'|'soon'|'late'}) =>
    setDetailVaccine({...v, petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾'})

  const handleSaveVaccine = (updated: VaccineRecord) => {
    const petId = selectedPetId
    const isBase = (VACCINES_BY_PET[petId]??[]).some(v=>v.name===updated.name)
    setExtraVacc(prev => {
      const existing = prev[petId]??[]
      if (isBase) {
        const alreadyExtra = existing.find(v=>v.name===updated.name)
        if (alreadyExtra) return { ...prev, [petId]:existing.map(v=>v.name===updated.name?updated:v) }
        return { ...prev, [petId]:[...existing,updated] }
      }
      return { ...prev, [petId]:existing.map(v=>v.name===updated.name?updated:v) }
    })
  }

  const handleMarkApplied = (v:VaccineRecord, appliedDate:string, nextDate:string) => {
    const lbl = new Date(appliedDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    const cls = getVaccStatus(nextDate)
    handleSaveVaccine({...v, applied:lbl, nextDate, badge:cls==='ok'?'AL DÍA':cls==='soon'?'POR VENCER':'VENCIDA', badgeCls:cls==='ok'?'badge-green':cls==='soon'?'badge-yellow':'badge-red'})
  }

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Vacunas</div><div className="page-subtitle">Control de vacunación de tus mascotas</div></div>
        <button className="btn btn-primary" onClick={()=>setRegisterOpen(true)}>💉 Registrar vacuna</button>
      </div>

      <div style={{ display:'flex',gap:'.5rem',marginBottom:'1.25rem',flexWrap:'wrap' }}>
        {MOCK_PETS.map(p=>(
          <button key={p.id} className={['btn',selectedPetId===p.id?'btn-primary':'btn-secondary'].join(' ')} onClick={()=>setSelectedPetId(p.id)}>
            {PET_EMOJI[p.species]??'🐾'} {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Vacunas de {pet.name}
            <button className="btn btn-primary btn-sm" onClick={()=>setRegisterOpen(true)}>💉 Registrar</button>
          </div>
          {withStatus.length===0
            ?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin vacunas registradas</div>
            :withStatus.map(v=>(
              <div key={v.name+v.nextDate}
                style={{ display:'flex',alignItems:'center',gap:'.875rem',padding:'.75rem 0',borderBottom:'1.5px solid var(--divider)',cursor:'pointer' }}
                onClick={()=>handleOpenDetail(v)}>
                <div className="vaccine-icon" style={{ background:eventBg(v.cls), color:eventColor(v.cls) }}>💉</div>
                <div style={{ flex:1 }}>
                  <div className="vaccine-name">{v.name}</div>
                  <div className="vaccine-date">Aplicada {v.applied}</div>
                </div>
                <div style={{ textAlign:'right',marginRight:'.5rem' }}>
                  <div className="vaccine-next" style={{ color:eventColor(v.cls) }}>
                    {v.cls==='late'
                      ?`Vencida · ${new Date(v.nextDate+'T12:00:00').toLocaleDateString('es-ES')}`
                      :`Próxima ${new Date(v.nextDate+'T12:00:00').toLocaleDateString('es-ES')}`}
                  </div>
                  <span className="badge" style={{ background:eventBg(v.cls), color:eventColor(v.cls), fontSize:'.6rem' }}>{v.badge}</span>
                </div>

              </div>
            ))
          }
        </div>

        <div className="card">
          <div className="card-title">Cobertura de {pet.name}</div>
          <div style={{ display:'flex',justifyContent:'center',margin:'1rem 0 1.5rem' }}>
            <VaccRing coverage={cov} size={96} strokeWidth={8}/>
          </div>
          {[{label:'Cobertura vacunal',pct:cov,color:''},{label:'Vacunas al día',pct:alPct,color:'success'},{label:'Pendientes/vencidas',pct:penPct,color:penPct>0?'warn':'success'}].map(b=>(
            <div key={b.label} style={{ marginBottom:'.875rem' }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:'.8125rem',marginBottom:'.375rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{b.label}</span><span style={{ fontWeight:700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar — shows ALL pets vaccines including Toby's late ones */}
      <div style={{ marginTop:'1.5rem' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem' }}>
          <div>
            <div className="page-title" style={{ fontSize:'1.125rem' }}>Calendario de eventos</div>
            <div className="page-subtitle">Vacunas y medicamentos de todas tus mascotas</div>
          </div>
        </div>
        <VaccinesCalendar allVaccines={allVaccinesForCalendar} extraVacc={extraVacc} initialDate={initialDate}/>
      </div>

      <RegisterVaccineModal petName={pet.name} isOpen={registerOpen} onClose={()=>setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister}/>
      <VaccineDetailModal vaccine={detailVaccine} onClose={()=>setDetailVaccine(null)} onEdit={v=>{setEditVaccine(v);setEditOpen(true)}} onMarkApplied={handleMarkApplied}/>
      <EditVaccineModal isOpen={editOpen} onClose={()=>setEditOpen(false)} vaccine={editVaccine} onSave={v=>{handleSaveVaccine(v);setEditOpen(false)}}/>
    </div>
  )
}
