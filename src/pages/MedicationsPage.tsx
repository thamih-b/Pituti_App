import { useState } from 'react'
import { showToast } from '../components/AppLayout'
import AddMedicationModal from '../components/AddMedicationModal'
import EditMedModal from '../components/EditMedModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'


const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }


const INITIAL_ACTIVE: MedRecord[] = [
  { id:'m1', icon:'💊', title:'Bravecto — Luna',          dose:'1 comprimido', frequency:'Cada 3 meses', startDate:'2026-01-10', endDate:'', notes:'', bg:'var(--warn-hl)', color:'var(--warn)', badge:'Activo', badgeCls:'badge-green', archived:false },
  { id:'m2', icon:'💉', title:'Pipeta antipulgas — Toby', dose:'1 pipeta',     frequency:'Mensual',      startDate:'2026-03-30', endDate:'', notes:'', bg:'var(--blue-hl)', color:'var(--blue)', badge:'Esta semana', badgeCls:'badge-yellow', archived:false },
]
const INITIAL_HISTORY: MedRecord[] = [
  { id:'h1', icon:'💊', title:'Amoxicilina — Luna',         dose:'1 comprimido / 12h', frequency:'Cada 12 horas', startDate:'2026-02-01', endDate:'2026-02-07', notes:'Infección leve. 7 días.', bg:'', color:'', badge:'Terminado', badgeCls:'badge-gray', archived:true },
  { id:'h2', icon:'💊', title:'Cortisona inyectable — Toby', dose:'2ml', frequency:'Única dosis', startDate:'2026-01-15', endDate:'2026-01-15', notes:'3 aplicaciones en total.', bg:'', color:'', badge:'Terminado', badgeCls:'badge-gray', archived:true },
]


interface DoseRecord { id:string; icon:string; bg:string; color:string; title:string; date:string; badge:string; badgeCls:string; daysLeft:number }
const INITIAL_DOSES: DoseRecord[] = [
  { id:'d1', icon:'💊', bg:'var(--warn-hl)', color:'var(--warn)', title:'Pipeta antipulgas · Toby', date:'30 abr 2026', badge:'17d', badgeCls:'badge-yellow', daysLeft:17 },
  { id:'d2', icon:'💊', bg:'var(--blue-hl)', color:'var(--blue)', title:'Bravecto · Luna',           date:'10 jul 2026', badge:'89d', badgeCls:'badge-green',  daysLeft:89 },
]


export default function MedicationsPage() {
  const [active,     setActive]     = useState<MedRecord[]>(INITIAL_ACTIVE)
  const [history,    setHistory]    = useState<MedRecord[]>(INITIAL_HISTORY)
  const [doses]                     = useState<DoseRecord[]>(INITIAL_DOSES)
  const [addOpen,    setAddOpen]    = useState(false)
  const [editOpen,   setEditOpen]   = useState(false)
  const [editMed,    setEditMed]    = useState<MedRecord | null>(null)


  const openEdit = (med: MedRecord) => { setEditMed(med); setEditOpen(true) }


  const handleAdd = (d: AddMedData) => {
    const petName  = PET_NAME[d.petId] ?? 'Mascota'
    const petEmoji = PET_EMOJI[d.petId] ?? '🐾'
    setActive(prev => [...prev, {
      id:`m${Date.now()}`, icon:'💊', title:`${d.name} — ${petEmoji} ${petName}`,
      dose:d.dose, frequency:d.frequency, startDate:d.startDate, endDate:d.endDate, notes:d.notes,
      bg:'var(--warn-hl)', color:'var(--warn)', badge:'Activo', badgeCls:'badge-green', archived:false,
    }])
  }


  const handleSaveEdit = (updated: MedRecord) => {
    if (updated.archived) {
      setHistory(prev => prev.map(m => m.id===updated.id ? updated : m))
    } else {
      setActive(prev => prev.map(m => m.id===updated.id ? updated : m))
    }
  }


  const handleDelete = (id: string) => {
    setActive(prev => prev.filter(m => m.id!==id))
    setHistory(prev => prev.filter(m => m.id!==id))
    showToast('Medicamento eliminado')
  }


  const archiveMed = (id: string) => {
    const med = active.find(m => m.id===id)
    if (!med) return
    setActive(prev => prev.filter(m => m.id!==id))
    setHistory(prev => [...prev, { ...med, archived:true, badge:'Terminado', badgeCls:'badge-gray' }])
    showToast('Medicamento archivado')
  }


  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Medicamentos</div><div className="page-subtitle">Tratamientos activos y archivados</div></div>
        <button className="btn btn-primary" onClick={()=>setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Añadir medicamento
        </button>
      </div>


      <div className="grid-2">
        {/* Active */}
        <div className="card">
          <div className="card-title">
            Activos
            {active.length > 0 && <span className="badge badge-green">{active.length}</span>}
          </div>
          {active.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>Sin medicamentos activos</div>
          ) : active.map(m=>(
            <div key={m.id} className="list-item">
              <div className="list-item-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
              <div className="list-item-info">
                <div className="list-item-title">{m.title}</div>
                <div className="list-item-sub">{m.dose} · {m.frequency}{m.endDate?` · hasta ${new Date(m.endDate+'T00:00:00').toLocaleDateString('es-ES')}`:''}</div>
              </div>
              <div className="med-row-actions">
                <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                <button className="med-edit-btn" onClick={()=>openEdit(m)} title="Editar">✏</button>
                <button className="med-archive-btn" onClick={()=>archiveMed(m.id)} title="Archivar">📁</button>
              </div>
            </div>
          ))}
        </div>


        {/* History */}
        <div className="card">
          <div className="card-title">Historial</div>
          {history.map(m=>(
            <div key={m.id} className="list-item" style={{ opacity:.65 }}>
              <div className="list-item-icon" style={{ background:'var(--surface-offset)', color:'var(--text-faint)' }}>{m.icon}</div>
              <div className="list-item-info">
                <div className="list-item-title">{m.title}</div>
                {/* ✅ LINHA CORRIGIDA ABAIXO */}
                <div className="list-item-sub">{m.dose} · {m.startDate ? new Date(m.startDate+'T00:00:00').toLocaleDateString('es-ES') : ''}{m.endDate ? ` → ${new Date(m.endDate+'T00:00:00').toLocaleDateString('es-ES')}` : ''}</div>
              </div>
              <div className="med-row-actions">
                <span className="badge badge-gray">Terminado</span>
                <button className="med-edit-btn" style={{ background:'var(--surface-offset)', color:'var(--text-muted)' }} onClick={()=>openEdit(m)} title="Editar">✏</button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Adherence + Doses */}
      <div className="grid-2" style={{ marginTop:'1.125rem' }}>
        <div className="card">
          <div className="card-title">Adherencia al tratamiento</div>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', padding:'.5rem 0' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink:0 }}>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--surface-offset)" strokeWidth="9"/>
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--success)" strokeWidth="9"
                strokeDasharray="226.2" strokeDashoffset="34" strokeLinecap="round" transform="rotate(-90 45 45)"/>
              <text x="45" y="50" textAnchor="middle" fontFamily="Nunito,sans-serif" fontWeight="800" fontSize="20" fill="var(--text)">85%</text>
            </svg>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.625rem' }}>
              {[
                { label:'BRAVECTO — LUNA', pct:100, color:'success', sub:'Al día ✓',           subColor:'var(--success)' },
                { label:'PIPETA — TOBY',   pct:70,  color:'warn',    sub:'Próxima en 17 días', subColor:'var(--warn)'    },
              ].map(b=>(
                <div key={b.label}>
                  <div style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-muted)', marginBottom:'.3rem' }}>{b.label}</div>
                  <div className="progress-wrap"><div className={`progress-bar ${b.color}`} style={{ width:`${b.pct}%` }}/></div>
                  <div style={{ fontSize:'.7rem', color:b.subColor, marginTop:'.2rem', fontWeight:700 }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="card">
          <div className="card-title">Próximas dosis</div>
          {doses.map(d=>(
            <div key={d.id} className="list-item">
              <div className="list-item-icon" style={{ background:d.bg, color:d.color }}>{d.icon}</div>
              <div className="list-item-info"><div className="list-item-title">{d.title}</div><div className="list-item-sub">{d.date}</div></div>
              <div className="med-row-actions">
                <span className={`badge ${d.badgeCls}`}>{d.badge}</span>
                <button className="med-edit-btn" title="Editar próxima dosis"
                  onClick={()=>{ const med = active.find(m=>m.title.toLowerCase().includes(d.title.split('·')[0].trim().toLowerCase())); if(med) openEdit(med) }}>
                  ✏
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <AddMedicationModal isOpen={addOpen} onClose={()=>setAddOpen(false)} onAdd={handleAdd}/>
      <EditMedModal isOpen={editOpen} onClose={()=>setEditOpen(false)} med={editMed} onSave={handleSaveEdit} onDelete={handleDelete}/>
    </div>
  )
}