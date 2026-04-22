import { useState } from 'react'
import { showToast } from '../components/AppLayout'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import { SymptomDetailModal, EditSymptomModal } from '../components/SymptomModals'
import { useSymptoms } from '../context/SymptomsContext'
import type { SymptomEntry } from '../context/SymptomsContext'
import type { SymptomData } from '../components/RegisterSymptomModal'
import BackButton from '../components/BackButton'

const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }
const SEV_ICON:  Record<string,string> = { leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨' }
const SEV_BADGE: Record<string,string> = { leve:'badge-yellow', moderado:'badge-yellow', grave:'badge-red', emergencia:'badge-red' }
const CAT_ICON:  Record<string,string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }
const SEV_COLOR: Record<string,string> = { leve:'var(--gold)', moderado:'var(--warn)', grave:'var(--err)', emergencia:'var(--err)' }
const SEV_BG:    Record<string,string> = { leve:'var(--gold-hl)', moderado:'var(--warn-hl)', grave:'var(--err-hl)', emergencia:'var(--err-hl)' }

function PencilIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
}

export default function SymptomsPage() {
  const { symptoms, addSymptom, saveSymptom, resolve, unresolve } = useSymptoms()
  const [addOpen,   setAddOpen]   = useState(false)
  const [detailSym, setDetailSym] = useState<SymptomEntry | null>(null)
  const [editSym,   setEditSym]   = useState<SymptomEntry | null>(null)
  const [editOpen,  setEditOpen]  = useState(false)

  const active   = symptoms.filter(s => !s.resolved)
  const resolved = symptoms.filter(s =>  s.resolved)

  const openEdit = (s: SymptomEntry) => { setEditSym(s); setEditOpen(true) }

  const handleAdd = (d: SymptomData) => {
    addSymptom({ ...d, resolved: false })
    showToast(`${SEV_ICON[d.severity]??'🌡️'} Síntoma registrado`)
  }

  const SymptomRow = ({ s, dim = false }: { s: SymptomEntry; dim?: boolean }) => (
    <div className="list-item symptom-row-clickable" style={{ opacity:dim?.7:1 }} onClick={() => setDetailSym(s)}>
      <div className="list-item-icon" style={{ background:dim?'var(--surface-offset)':SEV_BG[s.severity]||'var(--err-hl)', color:dim?'var(--text-faint)':SEV_COLOR[s.severity]||'var(--err)' }}>
        {CAT_ICON[s.category]??'🌡️'}
      </div>
      <div className="list-item-info">
        <div className="list-item-title">
          {SEV_ICON[s.severity]} {s.description.slice(0,40)}{s.description.length>40?'…':''} — {PET_EMOJI[s.petId]} {PET_NAME[s.petId]}
        </div>
        <div className="list-item-sub">
          {new Date(s.date+'T12:00:00').toLocaleDateString('es-ES')} · {s.category}{s.resolved?' · Resuelto':' · En observación'}
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'.25rem',alignItems:'flex-end',flexShrink:0 }}>
        <span className={`badge ${s.resolved?'badge-gray':SEV_BADGE[s.severity]??'badge-yellow'}`}>
          {s.resolved?'Resuelto':'Activo'}
        </span>
        <button className="med-edit-btn" style={{ width:26,height:26 }} title="Editar"
          onClick={e=>{e.stopPropagation();openEdit(s)}}>
          <PencilIcon size={12}/>
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Síntomas</div><div className="page-subtitle">Observaciones de comportamiento y salud</div></div>
        <button className="btn btn-primary" onClick={()=>setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Registrar síntoma
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Activos {active.length>0&&<span className="badge badge-red">{active.length} en obs.</span>}</div>
          {active.length===0
            ?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin síntomas activos ✓</div>
            :active.map(s=><SymptomRow key={s.id} s={s}/>)
          }
        </div>
        <div className="card">
          <div className="card-title">Resueltos</div>
          {resolved.length===0
            ?<div style={{ textAlign:'center',padding:'2rem',color:'var(--text-muted)',fontSize:'.875rem' }}>Sin síntomas resueltos</div>
            :resolved.map(s=><SymptomRow key={s.id} s={s} dim/>)
          }
        </div>
      </div>

      <div className="card" style={{ marginTop:'1.125rem' }}>
        <div className="card-title">Historial</div>
        <div className="timeline">
          {[...active,...resolved].slice(0,8).map(s=>(
            <div key={s.id} className="timeline-item symptom-row-clickable" onClick={()=>setDetailSym(s)}>
              <div className="tl-icon symptom">{CAT_ICON[s.category]??'🌡️'}</div>
              <div style={{ flex:1 }}>
                <div className="tl-title">{s.description.slice(0,50)}{s.description.length>50?'…':''} · {PET_EMOJI[s.petId]} {PET_NAME[s.petId]}</div>
                <div className="tl-meta">{s.resolved?'Resuelto':'En observación'} · {s.category}</div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'.25rem' }}>
                <div className="tl-time">{new Date(s.date+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short'})}</div>
                <button className="med-edit-btn" style={{ width:24,height:24 }} onClick={e=>{e.stopPropagation();openEdit(s)}}><PencilIcon size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterSymptomModal isOpen={addOpen} onClose={()=>setAddOpen(false)} onAdd={handleAdd}/>

      <SymptomDetailModal
        symptom={detailSym}
        onClose={()=>setDetailSym(null)}
        onEdit={s=>{setDetailSym(null);openEdit(s)}}
        onResolve={id=>{resolve(id);showToast('✓ Síntoma resuelto')}}
        onUnresolve={id=>{unresolve(id);showToast('↩ Síntoma reabierto')}}
      />

      <EditSymptomModal
        isOpen={editOpen}
        onClose={()=>setEditOpen(false)}
        symptom={editSym}
        onSave={updated=>{saveSymptom(updated);setEditOpen(false)}}
      />
    </div>
  )
}
