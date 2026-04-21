import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MOCK_PETS, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { RegisterVaccineModal } from './PetDetailPage'
import VaccRing from '../components/VaccRing'

const PET_EMOJI: Record<string,string> = { cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾' }

const HARDCODED_MEDS = [
  { date:'2026-04-30', petId:'pet-2', label:'Pipeta antipulgas' },
  { date:'2026-07-10', petId:'pet-1', label:'Bravecto'          },
]

const WEEKDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']
const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface CalEvent {
  type:'vaccine'|'medication'; petName:string; petEmoji:string; label:string
  status:'ok'|'soon'|'late'; color:string; bgColor:string
}

function VaccinesCalendar({ extraVacc, initialDate }: { extraVacc: Record<string,VaccineRecord[]>; initialDate?: string }) {
  const today    = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [viewMonth,   setViewMonth]   = useState(() => {
    if (initialDate) {
      const d = new Date(initialDate + 'T00:00:00')
      return new Date(d.getFullYear(), d.getMonth(), 1)
    }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDate ?? null)

  // Jump calendar when initialDate changes (from dashboard navigation)
  useEffect(() => {
    if (initialDate) {
      const d = new Date(initialDate + 'T00:00:00')
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
      setSelectedDay(initialDate)
    }
  }, [initialDate])

  const eventMap = useMemo(() => {
    const map: Record<string,CalEvent[]> = {}
    const add = (ds: string, ev: CalEvent) => { if (!map[ds]) map[ds]=[]; map[ds].push(ev) }

    for (const pet of MOCK_PETS) {
      const allVacc = [...(VACCINES_BY_PET[pet.id]??[]), ...(extraVacc[pet.id]??[])]
      for (const v of allVacc) {
        const status = getVaccStatus(v.nextDate) as 'ok'|'soon'|'late'
        add(v.nextDate, { type:'vaccine', petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:v.name, status, color:status==='late'?'var(--err)':status==='soon'?'var(--warn)':'var(--success)', bgColor:status==='late'?'var(--err-hl)':status==='soon'?'var(--gold-hl)':'var(--success-hl)' })
      }
    }
    for (const m of HARDCODED_MEDS) {
      const pet = MOCK_PETS.find(p=>p.id===m.petId); if(!pet) continue
      add(m.date, { type:'medication', petName:pet.name, petEmoji:PET_EMOJI[pet.species]??'🐾', label:m.label, status:'ok', color:'var(--blue)', bgColor:'var(--blue-hl)' })
    }
    return map
  }, [extraVacc])

  const cells = useMemo(() => {
    const year=viewMonth.getFullYear(), month=viewMonth.getMonth()
    const first=new Date(year,month,1), last=new Date(year,month+1,0)
    const startDow=(first.getDay()+6)%7
    const result: (null|{d:number;dateStr:string})[] = []
    for(let i=0;i<startDow;i++) result.push(null)
    for(let d=1;d<=last.getDate();d++) { const dt=new Date(year,month,d); result.push({d,dateStr:dt.toISOString().split('T')[0]}) }
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
        <button className="vacc-cal-today-btn"
          onClick={()=>{ setViewMonth(new Date(today.getFullYear(),today.getMonth(),1)); setSelectedDay(todayStr) }}>Hoy</button>
      </div>

      <div className="vacc-cal-weekdays">{WEEKDAYS.map(d=><div key={d} className="vacc-cal-wd">{d}</div>)}</div>

      <div className="vacc-cal-grid">
        {cells.map((cell,i)=>{
          if (!cell) return <div key={`pad-${i}`} className="vacc-cal-pad"/>
          const evts    = eventMap[cell.dateStr]??[]
          const isToday = cell.dateStr===todayStr
          const isSel   = cell.dateStr===selectedDay
          return (
            <div key={cell.dateStr}
              className={['vacc-cal-day', isToday?'is-today':'', isSel?'is-selected':'', evts.length>0?'has-events':''].join(' ')}
              onClick={()=>setSelectedDay(isSel?null:cell.dateStr)}>
              <span className={['vacc-cal-day-num', isToday?'today-circle':''].join(' ')}>{cell.d}</span>
              {evts.length>0 && (
                <div className="vacc-cal-dots">
                  {evts.slice(0,4).map((e,j)=><span key={j} className="vacc-cal-dot" style={{ background:e.color }}/>)}
                  {evts.length>4 && <span style={{ fontSize:'.5rem', color:'var(--text-faint)', fontWeight:800 }}>+{evts.length-4}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="vacc-cal-legend">
        {[{ color:'var(--err)',label:'Vencida/Urgente'},{ color:'var(--warn)',label:'Vence pronto (30d)'},{ color:'var(--success)',label:'Al día'},{ color:'var(--blue)',label:'Medicamento'}].map(l=>(
          <div key={l.label} className="vacc-cal-legend-item">
            <span className="vacc-cal-dot" style={{ background:l.color, width:8, height:8 }}/>{l.label}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="vacc-cal-panel">
          <div className="vacc-cal-panel-header">
            <span className="vacc-cal-panel-date">
              {new Date(selectedDay+'T00:00:00').toLocaleDateString('es-ES',{ weekday:'long',day:'numeric',month:'long' })}
            </span>
            <button className="vacc-cal-panel-close" onClick={()=>setSelectedDay(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {selectedEvents.length===0 ? (
            <div style={{ padding:'1.25rem', textAlign:'center', color:'var(--text-faint)', fontSize:'.875rem' }}>Sin eventos este día ✓</div>
          ) : (
            <div className="vacc-cal-event-list">
              {selectedEvents.map((ev,i)=>(
                <div key={i} className="vacc-cal-event-row">
                  <div className="vacc-cal-event-type-dot" style={{ background:ev.color }}/>
                  <div className="vacc-cal-event-icon" style={{ background:ev.bgColor }}>{ev.type==='vaccine'?'💉':'💊'}</div>
                  <div style={{ flex:1 }}>
                    <div className="vacc-cal-event-label">{ev.label}</div>
                    <div className="vacc-cal-event-pet">{ev.petEmoji} {ev.petName}</div>
                  </div>
                  <span className="badge" style={{ background:ev.bgColor, color:ev.color, fontSize:'.65rem' }}>
                    {ev.type==='vaccine'?(ev.status==='late'?'Vencida':ev.status==='soon'?'Pronto':'Al día'):'Med.'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function VaccinesPage() {
  const location = useLocation()
  const initialDate = (location.state as {initialDate?:string}|null)?.initialDate

  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0].id)
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [extraVacc,     setExtraVacc]     = useState<Record<string,VaccineRecord[]>>({})

  const pet        = MOCK_PETS.find(p=>p.id===selectedPetId)??MOCK_PETS[0]
  const base       = VACCINES_BY_PET[selectedPetId]??[]
  const extra      = extraVacc[selectedPetId]??[]
  const vaccines   = [...base, ...extra]
  const withStatus = vaccines.map(v=>({...v, cls:getVaccStatus(v.nextDate) as 'ok'|'soon'|'late'}))

  const okCount=withStatus.filter(v=>v.cls==='ok').length
  const alDia=withStatus.filter(v=>v.cls==='ok'||v.cls==='soon').length
  const pending=withStatus.filter(v=>v.cls==='soon'||v.cls==='late').length
  const total=vaccines.length
  const cov=total>0?Math.round(okCount/total*100):100
  const alPct=total>0?Math.round(alDia/total*100):100
  const penPct=total>0?Math.round(pending/total*100):0

  const handleRegister=({name,date,nextDate}:{name:string;date:string;nextDate:string;vet:string;notes:string})=>{
    const lbl=new Date(date).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
    const cls=getVaccStatus(nextDate)
    setExtraVacc(prev=>({...prev,[selectedPetId]:[...(prev[selectedPetId]??[]),{ name,applied:lbl,nextDate,badge:cls==='ok'?'AL DÍA':cls==='soon'?'POR VENCER':'VENCIDA',badgeCls:cls==='ok'?'badge-green':cls==='soon'?'badge-yellow':'badge-red' }]}))
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Vacunas</div><div className="page-subtitle">Control de vacunación de tus mascotas</div></div>
        <button className="btn btn-primary" onClick={()=>setRegisterOpen(true)}>💉 Registrar vacuna</button>
      </div>

      <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {MOCK_PETS.map(p=>(
          <button key={p.id} className={['btn', selectedPetId===p.id?'btn-primary':'btn-secondary'].join(' ')} onClick={()=>setSelectedPetId(p.id)}>
            {PET_EMOJI[p.species]??'🐾'} {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Vacunas de {pet.name} <button className="btn btn-primary btn-sm" onClick={()=>setRegisterOpen(true)}>💉 Registrar</button></div>
          {withStatus.length===0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>Sin vacunas registradas</div>
            : withStatus.map(v=>(
              <div key={v.name+v.nextDate} className="vaccine-row">
                <div className="vaccine-icon" style={{ background:v.cls==='ok'?'var(--success-hl)':v.cls==='soon'?'var(--gold-hl)':'var(--err-hl)', color:v.cls==='ok'?'var(--success)':v.cls==='soon'?'var(--gold)':'var(--err)' }}>💉</div>
                <div style={{ flex:1 }}><div className="vaccine-name">{v.name}</div><div className="vaccine-date">Aplicada {v.applied}</div></div>
                <div style={{ textAlign:'right' }}>
                  <div className={`vaccine-next ${v.cls}`}>{v.cls==='late'?`Vencida · ${new Date(v.nextDate).toLocaleDateString('es-ES')}`:` Próxima ${new Date(v.nextDate).toLocaleDateString('es-ES')}`}</div>
                  <span className={`badge ${v.badgeCls}`} style={{ fontSize:'.6rem' }}>{v.badge}</span>
                </div>
              </div>
            ))
          }
        </div>
        <div className="card">
          <div className="card-title">Cobertura de {pet.name}</div>
          <div style={{ display:'flex', justifyContent:'center', margin:'1rem 0 1.5rem' }}><VaccRing coverage={cov} size={96} strokeWidth={8}/></div>
          {[{label:'Cobertura vacunal',pct:cov,color:''},{label:'Vacunas al día',pct:alPct,color:'success'},{label:'Pendientes/vencidas',pct:penPct,color:penPct>0?'warn':'success'}].map(b=>(
            <div key={b.label} style={{ marginBottom:'.875rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8125rem', marginBottom:'.375rem' }}>
                <span style={{ color:'var(--text-muted)' }}>{b.label}</span><span style={{ fontWeight:700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div style={{ marginTop:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div><div className="page-title" style={{ fontSize:'1.125rem' }}>Calendario de eventos</div><div className="page-subtitle">Vacunas y medicamentos de todas tus mascotas</div></div>
        </div>
        <VaccinesCalendar extraVacc={extraVacc} initialDate={initialDate}/>
      </div>

      <RegisterVaccineModal petName={pet.name} isOpen={registerOpen} onClose={()=>setRegisterOpen(false)} vaccines={vaccines} onRegister={handleRegister}/>
    </div>
  )
}
