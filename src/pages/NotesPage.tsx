import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewNoteModal from '../components/NewNoteModal'
import { NoteDetailModal, EditNoteModal } from '../components/NoteModals'
import type { NoteEntry } from '../components/NoteModals'
import type { NoteData } from '../components/NewNoteModal'
import BackButton from '../components/BackButton'

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

const INITIAL_NOTES: NoteEntry[] = [
  { id:'n-1', petId:'pet-1', type:'control', vet:'Dra. Martínez', date:'2026-01-10',
    content:'Luna en buen estado. Peso estable 4.2 kg. Revisar vacuna antirrábica próximamente. Se recomienda dieta balanceada.', archived:false },
  { id:'n-2', petId:'pet-2', type:'emergencia', vet:'Dr. Sánchez', date:'2026-04-04',
    content:'Tos leve sin fiebre. Posible irritación traqueal. Mantener en observación 5-7 días. Si persiste, radiografía de tórax.', archived:false },
  { id:'n-3', petId:'pet-3', type:'control', vet:'Dra. López', date:'2026-03-20',
    content:'Plumaje brillante, comportamiento activo. Peso 32g dentro del rango normal. Vacuna polyomavirus aplicada. Próxima revisión en 1 año.', archived:false },
]

function NoteCard({ note, onClick, archived = false }: { note: NoteEntry; onClick: () => void; archived?: boolean }) {
  const pm = PET_META[note.petId]
  const tb = TYPE_BADGE[note.type] ?? TYPE_BADGE.otro
  const ti = TYPE_ICON[note.type]  ?? '📋'
  if (!pm) return null
  return (
    <div
      className={['card', archived ? 'note-card-archived' : ''].join(' ')}
      style={{ borderLeft:`4px solid ${archived ? 'var(--border)' : pm.borderColor}`, cursor:'pointer' }}
      onClick={onClick}>
      <div style={{ display:'flex', alignItems:'center', gap:'.625rem', marginBottom:'.75rem' }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background: archived ? 'var(--surface-offset)' : pm.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{pm.emoji}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:'.875rem', color:'var(--text)' }}>{pm.name}</div>
          <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{ti} {note.vet || 'Sin veterinario'}</div>
        </div>
        <span style={{ fontSize:'.75rem', color:'var(--text-faint)', marginLeft:'auto', flexShrink:0 }}>
          {new Date(note.date+'T12:00:00').toLocaleDateString('es-ES')}
        </span>
      </div>
      <p style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.6 }}>
        {note.content.length > 150 ? note.content.slice(0,150)+'…' : note.content}
      </p>
      <div style={{ marginTop:'.75rem', display:'flex', gap:'.375rem', flexWrap:'wrap' }}>
        <span className={`badge ${tb.cls}`}>{tb.label}</span>
        {note.vet && <span className="badge badge-gray">{note.vet}</span>}
        {archived && <span className="badge badge-gray" style={{ opacity:.65 }}>📁 Archivada</span>}
      </div>
    </div>
  )
}

export default function NotesPage() {
  const navigate = useNavigate()
  const [notes,     setNotes]     = useState<NoteEntry[]>(INITIAL_NOTES)
  const [addOpen,   setAddOpen]   = useState(false)
  const [detailNote,setDetailNote]= useState<NoteEntry | null>(null)
  const [editNote,  setEditNote]  = useState<NoteEntry | null>(null)
  const [editOpen,  setEditOpen]  = useState(false)

  const active   = notes.filter(n => !n.archived)
  const archived = notes.filter(n =>  n.archived)

  const openDetail = (n: NoteEntry) => setDetailNote(n)
  const openEdit   = (n: NoteEntry) => { setEditNote(n); setEditOpen(true) }

  const handleAdd = (d: NoteData) => {
    setNotes(prev => [{ ...d, id:`n-${Date.now()}`, archived:false }, ...prev])
  }

  const handleSaveEdit = (updated: NoteEntry) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
  }

  const handleArchive = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived:true } : n))
    showToast('📁 Nota archivada')
  }

  const handleUnarchive = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived:false } : n))
    showToast('✓ Nota desarchivada')
  }

  const showToast = (msg: string) => {
    // Reuse AppLayout toast
    import('../components/AppLayout').then(m => m.showToast(msg))
  }

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div>
          <div className="page-title">Notas</div>
          <div className="page-subtitle">Notas veterinarias y observaciones</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nueva nota
        </button>
      </div>

      {/* Active notes grid */}
      <div className="grid-auto">
        {active.map(n => (
          <NoteCard key={n.id} note={n} onClick={() => openDetail(n)}/>
        ))}

        {/* Add note card */}
        <div
          className="note-add-card"
          onClick={() => setAddOpen(true)}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setAddOpen(true)}
        >
          <div className="note-add-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="note-add-card-label">Nueva nota</div>
          <div className="note-add-card-sub">Control, observación o emergencia</div>
        </div>
      </div>

      {/* Archived section */}
      {archived.length > 0 && (
        <div className="notes-archived-section">
          <div className="notes-archived-title">
            <span>📁 Archivadas ({archived.length})</span>
          </div>
          <div className="grid-auto">
            {archived.map(n => (
              <NoteCard key={n.id} note={n} onClick={() => openDetail(n)} archived/>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewNoteModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd}/>

      <NoteDetailModal
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={n => { setDetailNote(null); openEdit(n) }}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
      />

      <EditNoteModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        note={editNote}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
