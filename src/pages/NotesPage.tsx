import { useState } from 'react'
import NewNoteModal from '../components/NewNoteModal'
import { NoteDetailModal, EditNoteModal, CURRENT_USER } from '../components/NoteModals'
import type { NoteEntry, NoteReply } from '../components/NoteModals'
import type { NoteData } from '../components/NewNoteModal'
import BackButton from '../components/BackButton'
import { showToast } from '../components/AppLayout'


/* ═══════════════════════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════════════════════════ */
const PET_META: Record<string,{ emoji:string; name:string; borderColor:string; bg:string }> = {
  'pet-1':{ emoji:'🐱', name:'Luna', borderColor:'var(--pal-lilac)', bg:'var(--pal-lilac)' },
  'pet-2':{ emoji:'🐶', name:'Toby', borderColor:'var(--pal-sky)',   bg:'var(--pal-sky)'   },
  'pet-3':{ emoji:'🦜', name:'Kiwi', borderColor:'var(--pal-mauve)', bg:'var(--pal-mauve)' },
}
const TYPE_ICON:  Record<string,string> = {
  control:'🩺', observacion:'👁', emergencia:'🚨', vacuna:'💉', cirugia:'🔬', otro:'📋',
}
const TYPE_BADGE: Record<string,{ label:string; cls:string }> = {
  control:     { label:'Control',     cls:'badge-blue'   },
  observacion: { label:'Observación', cls:'badge-gray'   },
  emergencia:  { label:'Emergencia',  cls:'badge-red'    },
  vacuna:      { label:'Post-vacuna', cls:'badge-green'  },
  cirugia:     { label:'Cirugía',     cls:'badge-yellow' },
  otro:        { label:'Nota',        cls:'badge-gray'   },
}

/* Cuidador secundário de demo */
const ANA_M = {
  id:'user-am', name:'Ana M.', avatar:'AM',
  color:'var(--blue-hl)', colorFg:'var(--blue)',
}


/* ═══════════════════════════════════════════════════════════════
   INITIAL NOTES — com autores e respostas de exemplo
══════════════════════════════════════════════════════════════════ */
const INITIAL_NOTES: NoteEntry[] = [
  {
    id:'n-1', petId:'pet-1', type:'control', vet:'Dra. Martínez', date:'2026-01-10',
    content:'Luna en buen estado. Peso estable 4.2 kg. Revisar vacuna antirrábica próximamente. Se recomienda dieta balanceada.',
    archived:false,
    authorId:CURRENT_USER.id, authorName:CURRENT_USER.name,
    authorAvatar:CURRENT_USER.avatar, authorColor:CURRENT_USER.color, authorColorFg:CURRENT_USER.colorFg,
    replies:[
      {
        id:'r-1-1', authorId:ANA_M.id, authorName:ANA_M.name,
        authorAvatar:ANA_M.avatar, authorColor:ANA_M.color, authorColorFg:ANA_M.colorFg,
        content:'Programé la cita para la vacuna antirrábica el 15 de febrero. ¡Confirmado con la clínica!',
        date:'2026-01-12',
      },
    ],
  },
  {
    id:'n-2', petId:'pet-2', type:'emergencia', vet:'Dr. Sánchez', date:'2026-04-04',
    content:'Tos leve sin fiebre. Posible irritación traqueal. Mantener en observación 5-7 días. Si persiste, radiografía de tórax.',
    archived:false,
    authorId:ANA_M.id, authorName:ANA_M.name,
    authorAvatar:ANA_M.avatar, authorColor:ANA_M.color, authorColorFg:ANA_M.colorFg,
    replies:[
      {
        id:'r-2-1', authorId:CURRENT_USER.id, authorName:CURRENT_USER.name,
        authorAvatar:CURRENT_USER.avatar, authorColor:CURRENT_USER.color, authorColorFg:CURRENT_USER.colorFg,
        content:'Vi que esta tarde ya está más activo. La tos disminuyó bastante. Le daré otro día antes de llamar.',
        date:'2026-04-06',
      },
    ],
  },
  {
    id:'n-3', petId:'pet-3', type:'control', vet:'Dra. López', date:'2026-03-20',
    content:'Plumaje brillante, comportamiento activo. Peso 32g dentro del rango normal. Vacuna polyomavirus aplicada. Próxima revisión en 1 año.',
    archived:false,
    authorId:CURRENT_USER.id, authorName:CURRENT_USER.name,
    authorAvatar:CURRENT_USER.avatar, authorColor:CURRENT_USER.color, authorColorFg:CURRENT_USER.colorFg,
    replies:[],
  },
]


/* ═══════════════════════════════════════════════════════════════
   NOTE CARD
══════════════════════════════════════════════════════════════════ */
function NoteCard({ note, onClick, archived = false }: {
  note:NoteEntry; onClick:() => void; archived?:boolean
}) {
  const pm  = PET_META[note.petId]
  const tb  = TYPE_BADGE[note.type] ?? TYPE_BADGE.otro
  const ti  = TYPE_ICON[note.type]  ?? '📋'
  const replies = note.replies ?? []
  if (!pm) return null

  return (
    <div
      className={['card', archived ? 'note-card-archived' : ''].join(' ')}
      style={{ borderLeft:`4px solid ${archived ? 'var(--border)' : pm.borderColor}`, cursor:'pointer' }}
      onClick={onClick}
    >
      {/* ── Pet + tipo ──────────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:'.625rem', marginBottom:'.75rem' }}>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background: archived ? 'var(--surface-offset)' : pm.bg,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.1rem', flexShrink:0,
        }}>
          {pm.emoji}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:'.875rem', color:'var(--text)' }}>{pm.name}</div>
          <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{ti} {note.vet || 'Sin veterinario'}</div>
        </div>
        <span style={{ fontSize:'.75rem', color:'var(--text-faint)', flexShrink:0 }}>
          {new Date(note.date + 'T12:00:00').toLocaleDateString('es-ES')}
        </span>
      </div>

      {/* ── Contenido ───────────────────────────────── */}
      <p style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.6 }}>
        {note.content.length > 140 ? note.content.slice(0,140) + '…' : note.content}
      </p>

      {/* ── Footer: autor + badges + replies ────────── */}
      <div style={{ marginTop:'.75rem', display:'flex', alignItems:'center', gap:'.375rem', flexWrap:'wrap' }}>
        {/* Autor */}
        {note.authorName && (
          <div style={{
            display:'flex', alignItems:'center', gap:'.3rem',
            background:'var(--surface-offset)', border:'1px solid var(--border)',
            borderRadius:'var(--r-full)', padding:'.15rem .5rem .15rem .25rem',
          }}>
            <div style={{
              width:18, height:18, borderRadius:'50%',
              background: note.authorColor ?? 'var(--primary-hl)',
              color: note.authorColorFg ?? 'var(--primary)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'.55rem', fontWeight:800,
            }}>
              {note.authorAvatar ?? note.authorName.slice(0,2)}
            </div>
            <span style={{ fontSize:'.72rem', fontWeight:700, color:'var(--text-muted)' }}>
              {note.authorId === CURRENT_USER.id ? 'Tú' : note.authorName}
            </span>
          </div>
        )}

        {/* Tipo */}
        <span className={`badge ${tb.cls}`}>{tb.label}</span>

        {/* Replies badge */}
        {replies.length > 0 && (
          <span className="badge badge-gray" style={{ marginLeft:'auto' }}>
            💬 {replies.length}
          </span>
        )}

        {archived && (
          <span className="badge badge-gray" style={{ opacity:.65 }}>📁 Archivada</span>
        )}
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   NOTES PAGE
══════════════════════════════════════════════════════════════════ */
export default function NotesPage() {
  const [notes,      setNotes]      = useState<NoteEntry[]>(INITIAL_NOTES)
  const [addOpen,    setAddOpen]    = useState(false)
  const [detailNote, setDetailNote] = useState<NoteEntry | null>(null)
  const [editNote,   setEditNote]   = useState<NoteEntry | null>(null)
  const [editOpen,   setEditOpen]   = useState(false)

  const active   = notes.filter(n => !n.archived)
  const archived = notes.filter(n =>  n.archived)

  /* ── Handlers ──────────────────────────────────────── */
  const handleAdd = (d: NoteData) => {
    const newNote: NoteEntry = {
      ...d,
      id:           `n-${Date.now()}`,
      archived:     false,
      replies:      [],
      /* Author = current user */
      authorId:     CURRENT_USER.id,
      authorName:   CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      authorColor:  CURRENT_USER.color,
      authorColorFg:CURRENT_USER.colorFg,
    }
    setNotes(prev => [newNote, ...prev])
  }

  const handleSaveEdit = (updated: NoteEntry) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
  }

  const handleArchive   = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived:true  } : n))
    showToast('📁 Nota archivada')
  }
  const handleUnarchive = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived:false } : n))
    showToast('✓ Nota desarchivada')
  }
  const handleDelete    = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    showToast('🗑 Nota eliminada')
  }

  /* ── Reply: adiciona uma "nota dentro da nota" ───── */
  const handleAddReply = (noteId: string, reply: NoteReply) => {
    setNotes(prev => prev.map(n =>
      n.id === noteId
        ? { ...n, replies: [...(n.replies ?? []), reply] }
        : n
    ))
    /* Actualiza o detalhe se estiver aberto */
    setDetailNote(prev =>
      prev?.id === noteId
        ? { ...prev, replies: [...(prev.replies ?? []), reply] }
        : prev
    )
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nueva nota
        </button>
      </div>

      {/* ── Notas activas ──────────────────────────────── */}
      <div className="grid-auto">
        {active.map(n => (
          <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} />
        ))}

        {/* Tarjeta añadir */}
        <div
          className="note-add-card"
          onClick={() => setAddOpen(true)}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setAddOpen(true)}
        >
          <div className="note-add-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="note-add-card-label">Nueva nota</div>
          <div className="note-add-card-sub">Control, observación o emergencia</div>
        </div>
      </div>

      {/* ── Archivadas ─────────────────────────────────── */}
      {archived.length > 0 && (
        <div className="notes-archived-section">
          <div className="notes-archived-title">
            <span>📁 Archivadas ({archived.length})</span>
          </div>
          <div className="grid-auto">
            {archived.map(n => (
              <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} archived />
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────── */}
      <NewNoteModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <NoteDetailModal
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={n => { setDetailNote(null); setEditNote(n); setEditOpen(true) }}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        onAddReply={handleAddReply}
      />

      <EditNoteModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        note={editNote}
        onSave={updated => { handleSaveEdit(updated); setEditOpen(false) }}
      />
    </div>
  )
}
