import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NewNoteModal from '../components/NewNoteModal'
import { NoteDetailModal, EditNoteModal } from '../components/NoteModals'
import type { NoteEntry, NoteReply } from '../components/NoteModals'
import type { NoteData } from '../components/NewNoteModal'
import BackButton from '../components/BackButton'
import { showToast } from '../components/AppLayout'
import { usePetsContext } from '../context/PetsContext'
import {SPECIES_EMOJI} from '../hooks/usePets'
import { useUser } from '../context/UserContext'


const TYPE_ICON: Record<string, string> = {
  control: '🩺', observacion: '👁', emergencia: '🚨', vacuna: '💉', cirugia: '🔬', otro: '📋',
}


// ── NoteCard ──────────────────────────────────────────────────────

function NoteCard({ note, onClick, archived = false }: {
  note: NoteEntry; onClick: () => void; archived?: boolean
}) {
  const { t } = useTranslation()
  const { pets } = usePetsContext()  
  const { user } = useUser()
  
  const pet = pets.find(p => p.id === note.petId)  
  if (!pet) return null
  
  const pm = {
    emoji: SPECIES_EMOJI[pet.species] ?? '🐾',
    name: pet.name,
    borderColor: 'var(--primary)',  // ou usa lógica de cor por species
    bg: 'var(--primary-hl)',
  }
  const ti = TYPE_ICON[note.type] ?? '📋'

  const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
    control:     { label: t('notes.typeOptions.control'),     cls: 'badge-blue'   },
    observacion: { label: t('notes.typeOptions.observacion'), cls: 'badge-gray'   },
    emergencia:  { label: t('notes.typeOptions.emergencia'),  cls: 'badge-red'    },
    vacuna:      { label: t('notes.typeOptions.vacuna'),      cls: 'badge-green'  },
    cirugia:     { label: t('notes.typeOptions.cirugia'),     cls: 'badge-yellow' },
    otro:        { label: t('notes.typeOptions.otro'),        cls: 'badge-gray'   },
  }

  const tb      = TYPE_BADGE[note.type] ?? TYPE_BADGE.otro
  const replies = note.replies ?? []
  if (!pm) return null

  return (
    <div
      className={['card', archived ? 'note-card-archived' : ''].join(' ')}
      style={{ borderLeft: `4px solid ${archived ? 'var(--border)' : pm.borderColor}`, cursor: 'pointer' }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem', marginBottom: '.75rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: archived ? 'var(--surface-offset)' : pm.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', flexShrink: 0,
        }}>
          {pm.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--text)' }}>{pm.name}</div>
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>
            {ti} {note.vet || t('field.vet')}
          </div>
        </div>
        <span style={{ fontSize: '.75rem', color: 'var(--text-faint)', flexShrink: 0 }}>
          {new Date(note.date + 'T12:00:00').toLocaleDateString(t('dates.locale'))}
        </span>
      </div>

      <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {note.content.length > 140 ? note.content.slice(0, 140) + '…' : note.content}
      </p>

      <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'center', gap: '.375rem', flexWrap: 'wrap' }}>
        {note.authorName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.3rem',
            background: 'var(--surface-offset)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-full)', padding: '.15rem .5rem .15rem .25rem',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: note.authorColor ?? 'var(--primary-hl)',
              color: note.authorColorFg ?? 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.55rem', fontWeight: 800,
            }}>
              {note.authorAvatar ?? note.authorName.slice(0, 2)}
            </div>
            {/* ✅ corrigido: chave correcta + "Você" em PT */}
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {note.authorId === user.email ? t('pet.share.badgeYou') : note.authorName}
            </span>
          </div>
        )}

        <span className={`badge ${tb.cls}`}>{tb.label}</span>

        {replies.length > 0 && (
          <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>
            💬 {replies.length}
          </span>
        )}

        {archived && (
          <span className="badge badge-gray" style={{ opacity: .65 }}>
            📁 {t('notes.archived')}
          </span>
        )}
      </div>
    </div>
  )
}


// ── NotesPage ─────────────────────────────────────────────────────
export default function NotesPage() {
  const { t } = useTranslation()

  // ✅ mock removido — array vazio, será populado pela API
  const [notes,      setNotes]      = useState<NoteEntry[]>([])
  const [addOpen,    setAddOpen]    = useState(false)
  const [detailNote, setDetailNote] = useState<NoteEntry | null>(null)
  const [editNote,   setEditNote]   = useState<NoteEntry | null>(null)
  const [editOpen,   setEditOpen]   = useState(false)

  const active   = notes.filter((n) => !n.archived)
  const archived = notes.filter((n) =>  n.archived)

  const handleAdd = (d: NoteData) => {
  const { user } = useUser()
  const newNote: NoteEntry = {
    ...d,
    id: `n-${Date.now()}`,
    archived: false,
    replies: [],
    authorId: user.email,  // ou user.id
    authorName: user.name,
    authorAvatar: user.avatar,
    authorColor: user.color,
    authorColorFg: user.colorFg,
  }
  setNotes((prev) => [newNote, ...prev])
}

  const handleSaveEdit = (updated: NoteEntry) => {
    setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n))
  }

  const handleArchive = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, archived: true } : n))
    showToast(t('toast.noteArchived'))
  }

  const handleUnarchive = (id: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, archived: false } : n))
    showToast(t('toast.noteUnarchived'))
  }

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    showToast(t('toast.noteDeleted'))
  }

  const handleAddReply = (noteId: string, reply: NoteReply) => {
    setNotes((prev) => prev.map((n) =>
      n.id === noteId ? { ...n, replies: [...(n.replies ?? []), reply] } : n
    ))
    setDetailNote((prev) =>
      prev?.id === noteId ? { ...prev, replies: [...(prev.replies ?? []), reply] } : prev
    )
  }

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <div>
          <div className="page-title">{t('notes.title')}</div>
          <div className="page-subtitle">{t('notes.subtitle')}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t('notes.new')}
        </button>
      </div>

      <div className="grid-auto">
        {active.map((n) => (
          <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} />
        ))}

        <div
          className="note-add-card"
          onClick={() => setAddOpen(true)}
          role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setAddOpen(true)}
        >
          <div className="note-add-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div className="note-add-card-label">{t('notes.new')}</div>
          <div className="note-add-card-sub">{t('notes.addHint')}</div>
        </div>
      </div>

      {archived.length > 0 && (
        <div className="notes-archived-section">
          <div className="notes-archived-title">
            <span>📁 {t('notes.archived')} ({archived.length})</span>
          </div>
          <div className="grid-auto">
            {archived.map((n) => (
              <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} archived />
            ))}
          </div>
        </div>
      )}

      <NewNoteModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <NoteDetailModal
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={(n) => { setDetailNote(null); setEditNote(n); setEditOpen(true) }}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        onAddReply={handleAddReply}
      />

      <EditNoteModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        note={editNote}
        onSave={(updated) => { handleSaveEdit(updated); setEditOpen(false) }}
      />
    </div>
  )
}