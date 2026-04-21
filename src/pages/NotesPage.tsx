import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewNoteModal from '../components/NewNoteModal'
import type { NoteData } from '../components/NewNoteModal'

interface NoteEntry extends NoteData { id: string }

const INITIAL_NOTES: NoteEntry[] = [
  { id:'n-1', petId:'pet-1', type:'control', vet:'Dra. Martínez', date:'2026-01-10',
    content:'Luna en buen estado. Peso estable 4.2 kg. Revisar vacuna antirrábica próximamente. Se recomienda dieta balanceada.' },
  { id:'n-2', petId:'pet-2', type:'emergencia', vet:'Dr. Sánchez', date:'2026-04-04',
    content:'Tos leve sin fiebre. Posible irritación traqueal. Mantener en observación 5-7 días. Si persiste, radiografía de tórax.' },
  { id:'n-3', petId:'pet-3', type:'control', vet:'Dra. López', date:'2026-03-20',
    content:'Plumaje brillante, comportamiento activo. Peso 32g dentro del rango normal. Vacuna polyomavirus aplicada. Próxima revisión en 1 año.' },
]

const PET_META: Record<string,{ emoji:string; name:string; borderColor:string; bg:string }> = {
  'pet-1': { emoji:'🐱', name:'Luna', borderColor:'var(--pal-lilac)', bg:'var(--pal-lilac)' },
  'pet-2': { emoji:'🐶', name:'Toby', borderColor:'var(--pal-sky)',   bg:'var(--pal-sky)'   },
  'pet-3': { emoji:'🦜', name:'Kiwi', borderColor:'var(--pal-mauve)', bg:'var(--pal-mauve)' },
}
const TYPE_ICON:  Record<string,string>  = { control:'🩺', observacion:'👁', emergencia:'🚨', vacuna:'💉', cirugia:'🔬', otro:'📋' }
const TYPE_BADGE: Record<string,{ label:string; cls:string }> = {
  control:     { label:'Control',     cls:'badge-blue'   },
  observacion: { label:'Observación', cls:'badge-gray'   },
  emergencia:  { label:'Emergencia',  cls:'badge-red'    },
  vacuna:      { label:'Post-vacuna', cls:'badge-green'  },
  cirugia:     { label:'Cirugía',     cls:'badge-yellow' },
  otro:        { label:'Nota',        cls:'badge-gray'   },
}

export default function NotesPage() {
  const navigate    = useNavigate()
  const [notes,     setNotes]     = useState<NoteEntry[]>(INITIAL_NOTES)
  const [modalOpen, setModalOpen] = useState(false)

  const handleAdd = (d: NoteData) => {
    setNotes(prev => [{ ...d, id:`n-${Date.now()}` }, ...prev])
  }

  const openModal = () => setModalOpen(true)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Notas</div>
          <div className="page-subtitle">Notas veterinarias y observaciones</div>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva nota
        </button>
      </div>

      <div className="grid-auto">
        {notes.map(n => {
          const pm = PET_META[n.petId]
          const tb = TYPE_BADGE[n.type] ?? TYPE_BADGE.otro
          const ti = TYPE_ICON[n.type]  ?? '📋'
          if (!pm) return null
          return (
            <div key={n.id} className="card"
              style={{ borderLeft:`4px solid ${pm.borderColor}`, cursor:'pointer' }}
              onClick={() => navigate(`/pets/${n.petId}`)}>
              <div style={{ display:'flex', alignItems:'center', gap:'.625rem', marginBottom:'.75rem' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:pm.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{pm.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:'.875rem', color:'var(--text)' }}>{pm.name}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{ti} {n.vet || 'Sin veterinario'}</div>
                </div>
                <span style={{ fontSize:'.75rem', color:'var(--text-faint)', marginLeft:'auto', flexShrink:0 }}>
                  {new Date(n.date+'T00:00:00').toLocaleDateString('es-ES')}
                </span>
              </div>
              <p style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.6 }}>
                {n.content.length > 150 ? n.content.slice(0,150)+'…' : n.content}
              </p>
              <div style={{ marginTop:'.75rem', display:'flex', gap:'.375rem', flexWrap:'wrap' }}>
                <span className={`badge ${tb.cls}`}>{tb.label}</span>
                {n.vet && <span className="badge badge-gray">{n.vet}</span>}
              </div>
            </div>
          )
        })}

        {/* ── Add note card — exactly like "Añadir mascota" in PetListPage ── */}
        <div
          className="note-add-card"
          onClick={openModal}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && openModal()}
          title="Nueva nota"
        >
          <div className="note-add-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="note-add-card-label">Nueva nota</div>
          <div className="note-add-card-sub">Registra un control, observación o emergencia</div>
        </div>
      </div>

      <NewNoteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd}/>
    </div>
  )
}
