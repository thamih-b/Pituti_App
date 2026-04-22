import { useState } from 'react'
import { showToast } from '../components/AppLayout'
import AddMedicationModal from '../components/AddMedicationModal'
import EditMedModal from '../components/EditMedModal'
import MedDetailModal from '../components/MedDetailModal'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'
import BackButton  from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }

// Pencil icon
function PencilIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
    </svg>
  )
}

const INITIAL_ACTIVE: MedRecord[] = [
  { id:'m1', icon:'💊', title:'Bravecto — Luna',          dose:'1 comprimido', frequency:'Cada 3 meses', startDate:'2026-01-10', endDate:'', notes:'Antiparasitario oral.', bg:'var(--warn-hl)', color:'var(--warn)', badge:'Activo', badgeCls:'badge-green', archived:false },
  { id:'m2', icon:'💉', title:'Pipeta antipulgas — Toby', dose:'1 pipeta',     frequency:'Mensual',      startDate:'2026-03-30', endDate:'', notes:'Aplicar en la nuca.', bg:'var(--blue-hl)', color:'var(--blue)', badge:'Esta semana', badgeCls:'badge-yellow', archived:false },
]
const INITIAL_HISTORY: MedRecord[] = [
  { id:'h1', icon:'💊', title:'Amoxicilina — Luna',         dose:'1 comprimido / 12h', frequency:'Cada 12 horas', startDate:'2026-02-01', endDate:'2026-02-07', notes:'Infección leve. 7 días.', bg:'', color:'', badge:'Terminado', badgeCls:'badge-gray', archived:true },
  { id:'h2', icon:'💊', title:'Cortisona inyectable — Toby', dose:'2ml', frequency:'Única dosis', startDate:'2026-01-15', endDate:'2026-01-15', notes:'3 aplicaciones en total.', bg:'', color:'', badge:'Terminado', badgeCls:'badge-gray', archived:true },
]

interface DoseRecord { id:string; medId:string; icon:string; bg:string; color:string; title:string; date:string; badge:string; badgeCls:string; daysLeft:number }
const INITIAL_DOSES: DoseRecord[] = [
  { id:'d1', medId:'m2', icon:'💊', bg:'var(--warn-hl)', color:'var(--warn)', title:'Pipeta antipulgas · Toby', date:'30 abr 2026', badge:'17d', badgeCls:'badge-yellow', daysLeft:17 },
  { id:'d2', medId:'m1', icon:'💊', bg:'var(--blue-hl)', color:'var(--blue)', title:'Bravecto · Luna',           date:'10 jul 2026', badge:'89d', badgeCls:'badge-green',  daysLeft:89 },
]

export default function MedicationsPage() {
  const [active,      setActive]      = useState<MedRecord[]>(INITIAL_ACTIVE)
  const [history,     setHistory]     = useState<MedRecord[]>(INITIAL_HISTORY)
  const [addOpen,     setAddOpen]     = useState(false)
  const [editOpen,    setEditOpen]    = useState(false)
  const [editMed,     setEditMed]     = useState<MedRecord | null>(null)
  const [detailMed,   setDetailMed]   = useState<MedRecord | null>(null)

  const openEdit  = (med: MedRecord) => { setEditMed(med); setEditOpen(true) }
  const openDetail = (med: MedRecord) => setDetailMed(med)

  const handleAdd = (d: AddMedData) => {
    const petName  = PET_NAME[d.petId] ?? 'Mascota'
    const petEmoji = PET_EMOJI[d.petId] ?? '🐾'
    setActive(prev => [...prev, {
      id: `m${Date.now()}`, icon:'💊', title:`${d.name} — ${petEmoji} ${petName}`,
      dose:d.dose, frequency:d.frequency, startDate:d.startDate, endDate:d.endDate, notes:d.notes,
      bg:'var(--warn-hl)', color:'var(--warn)', badge:'Activo', badgeCls:'badge-green', archived:false,
    }])
  }

  const handleSaveEdit = (updated: MedRecord) => {
    if (updated.archived) {
      setHistory(prev => prev.map(m => m.id === updated.id ? updated : m))
    } else {
      setActive(prev => prev.map(m => m.id === updated.id ? updated : m))
    }
    showToast('Medicamento actualizado')
  }

  const handleDelete = (id: string) => {
    setActive(prev => prev.filter(m => m.id !== id))
    setHistory(prev => prev.filter(m => m.id !== id))
    showToast('Medicamento eliminado')
  }

  const archiveMed = (id: string) => {
    const med = active.find(m => m.id === id); if (!med) return
    setActive(prev => prev.filter(m => m.id !== id))
    setHistory(prev => [...prev, { ...med, archived:true, badge:'Terminado', badgeCls:'badge-gray' }])
    showToast('Medicamento archivado')
  }

  const unarchiveMed = (id: string) => {
    const med = history.find(m => m.id === id); if (!med) return
    setHistory(prev => prev.filter(m => m.id !== id))
    setActive(prev => [...prev, { ...med, archived:false, badge:'Activo', badgeCls:'badge-green' }])
    showToast('Medicamento desarchivado ✓')
  }

  const handleMarkAdministered = (med: MedRecord, date: string) => {
    const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' })
    showToast(`✓ ${med.title} administrado el ${dateStr}`)
  }

  // Edit from detail
  const handleDetailEdit = (med: MedRecord) => { setDetailMed(null); openEdit(med) }

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Medicamentos</div><div className="page-subtitle">Tratamientos activos y archivados</div></div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
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
          {active.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>Sin medicamentos activos</div>
            : active.map(m => (
              <div key={m.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">{m.dose} · {m.frequency}</div>
                </div>
                <div className="med-row-actions">
                  <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                  <button className="med-archive-btn" title="Archivar"
                    onClick={e => { e.stopPropagation(); archiveMed(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/>
                      <line x1="10" y1="12" x2="14" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        {/* History */}
        <div className="card">
          <div className="card-title">Historial</div>
          {history.length === 0
            ? <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>Sin historial</div>
            : history.map(m => (
              <div key={m.id} className="list-item" style={{ opacity:.7, cursor:'pointer' }} onClick={() => openDetail(m)}>
                <div className="list-item-icon" style={{ background:'var(--surface-offset)', color:'var(--text-faint)' }}>{m.icon}</div>
                <div className="list-item-info">
                  <div className="list-item-title">{m.title}</div>
                  <div className="list-item-sub">
                    {m.dose}
                    {m.startDate ? ` · ${new Date(m.startDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})}` : ''}
                    {m.endDate   ? ` → ${new Date(m.endDate+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})}` : ''}
                  </div>
                </div>
                <div className="med-row-actions">
                  <span className="badge badge-gray">Terminado</span>
                  {/* Unarchive */}
                  <button className="med-edit-btn" title="Desarchivar" style={{ background:'var(--success-hl)', color:'var(--success)' }}
                    onClick={e => { e.stopPropagation(); unarchiveMed(m.id) }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/>
                      <polyline points="10 12 12 10 14 12"/><line x1="12" y1="10" x2="12" y2="16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          }
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
          {INITIAL_DOSES.map(d => {
            const linked = [...active, ...history].find(m => m.id === d.medId)
            return (
              <div key={d.id} className="list-item" style={{ cursor:'pointer' }} onClick={() => linked && openDetail(linked)}>
                <div className="list-item-icon" style={{ background:d.bg, color:d.color }}>{d.icon}</div>
                <div className="list-item-info"><div className="list-item-title">{d.title}</div><div className="list-item-sub">{d.date}</div></div>
                <div className="med-row-actions">
                  <span className={`badge ${d.badgeCls}`}>{d.badge}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <AddMedicationModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>
      <EditMedModal isOpen={editOpen} onClose={() => setEditOpen(false)} med={editMed} onSave={handleSaveEdit} onDelete={handleDelete}/>
      <MedDetailModal med={detailMed} onClose={() => setDetailMed(null)} onEdit={handleDetailEdit} onMarkAdministered={handleMarkAdministered}/>
    </div>
  )
}
