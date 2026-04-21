import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../components/AppLayout'
import RegisterSymptomModal from '../components/RegisterSymptomModal'
import type { SymptomData } from '../components/RegisterSymptomModal'

const PET_EMOJI: Record<string,string> = { 'pet-1':'🐱', 'pet-2':'🐶', 'pet-3':'🦜' }
const PET_NAME:  Record<string,string> = { 'pet-1':'Luna', 'pet-2':'Toby', 'pet-3':'Kiwi' }

const SEV_ICON:  Record<string,string> = { leve:'🟡', moderado:'🟠', grave:'🔴', emergencia:'🚨' }
const SEV_BADGE: Record<string,string> = { leve:'badge-yellow', moderado:'badge-yellow', grave:'badge-red', emergencia:'badge-red' }
const CAT_ICON:  Record<string,string> = { digestivo:'🤢', respiratorio:'🫁', piel:'🩹', comportamiento:'🧠', movimiento:'🦶', ocular:'👁', otro:'❓' }

interface SymptomEntry extends SymptomData { id: string; resolved: boolean }

const INITIAL_SYMPTOMS: SymptomEntry[] = [
  { id:'s-1', petId:'pet-2', description:'Tos suave sin fiebre. Parece cansado.', category:'respiratorio', severity:'moderado', date:'2026-04-18', notes:'', resolved:false },
]
const RESOLVED: SymptomEntry[] = [
  { id:'r-1', petId:'pet-1', description:'Inapetencia varios días', category:'digestivo', severity:'leve', date:'2026-02-10', notes:'', resolved:true },
  { id:'r-2', petId:'pet-2', description:'Cojera leve pata trasera', category:'movimiento', severity:'leve', date:'2026-01-15', notes:'', resolved:true },
]

export default function SymptomsPage() {
  const navigate = useNavigate()
  const [symptoms,   setSymptoms]   = useState<SymptomEntry[]>(INITIAL_SYMPTOMS)
  const [modalOpen,  setModalOpen]  = useState(false)

  const handleAdd = (d: SymptomData) => {
    setSymptoms(prev => [...prev, { ...d, id: `s-${Date.now()}`, resolved: false }])
    showToast(`${SEV_ICON[d.severity] ?? '🌡️'} Síntoma registrado`)
  }

  const markResolved = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id))
    showToast('✓ Marcado como resuelto')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Síntomas</div>
          <div className="page-subtitle">Observaciones de comportamiento y salud</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Registrar síntoma
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Activos
            {symptoms.length > 0 && <span className="badge badge-red">{symptoms.length} en obs.</span>}
          </div>
          {symptoms.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontSize:'.875rem' }}>
              Sin síntomas activos ✓
            </div>
          ) : symptoms.map(s => (
            <div key={s.id} className="list-item" onClick={() => navigate(`/pets/${s.petId}`)}>
              <div className="list-item-icon" style={{ background:'var(--err-hl)', color:'var(--err)' }}>
                {CAT_ICON[s.category] ?? '🌡️'}
              </div>
              <div className="list-item-info">
                <div className="list-item-title">
                  {SEV_ICON[s.severity]} {s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''} — {PET_EMOJI[s.petId]} {PET_NAME[s.petId]}
                </div>
                <div className="list-item-sub">
                  {new Date(s.date+'T00:00:00').toLocaleDateString('es-ES')} · En observación · {s.category}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'.25rem', alignItems:'flex-end' }}>
                <span className={`badge ${SEV_BADGE[s.severity] ?? 'badge-yellow'}`}>Activo</span>
                <button className="btn btn-sm" style={{ fontSize:'.65rem', padding:'.2rem .5rem', color:'var(--success)', border:'1px solid var(--success)', borderRadius:'var(--r-full)', background:'var(--success-hl)' }}
                  onClick={e => { e.stopPropagation(); markResolved(s.id) }}>
                  ✓ Resolver
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Resueltos</div>
          {RESOLVED.map(s => (
            <div key={s.id} className="list-item" style={{ opacity:.6 }}>
              <div className="list-item-icon" style={{ background:'var(--surface-offset)', color:'var(--text-faint)' }}>
                {CAT_ICON[s.category] ?? '🌡️'}
              </div>
              <div className="list-item-info">
                <div className="list-item-title">{s.description.slice(0, 40)}{s.description.length > 40 ? '…' : ''} — {PET_EMOJI[s.petId]} {PET_NAME[s.petId]}</div>
                <div className="list-item-sub">Resuelto · {new Date(s.date+'T00:00:00').toLocaleDateString('es-ES')}</div>
              </div>
              <span className="badge badge-gray">Resuelto</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="card" style={{ marginTop:'1.125rem' }}>
        <div className="card-title">Historial</div>
        <div className="timeline">
          {[...symptoms, ...RESOLVED].slice(0, 6).map(e => (
            <div key={e.id} className="timeline-item">
              <div className={`tl-icon symptom`}>{CAT_ICON[e.category] ?? '🌡️'}</div>
              <div style={{ flex:1 }}>
                <div className="tl-title">
                  {e.description.slice(0, 50)}{e.description.length > 50 ? '…' : ''} · {PET_EMOJI[e.petId]} {PET_NAME[e.petId]}
                </div>
                <div className="tl-meta">{e.resolved ? 'Resuelto' : 'En observación'} · {e.category}</div>
              </div>
              <div className="tl-time">{new Date(e.date+'T00:00:00').toLocaleDateString('es-ES', { day:'2-digit', month:'short' })}</div>
            </div>
          ))}
        </div>
      </div>

      <RegisterSymptomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
