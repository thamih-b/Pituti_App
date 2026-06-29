// NotesPage.tsx - Usa NotesContext para persistência real
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { usePetsContext } from '../context/PetsContext';
import { useNotes } from '../context/NotesContext';
import BackButton from "../components/BackButton";
import { showToast } from '../components/AppLayout';
import {
  NoteDetailModal,
  EditNoteModal,
  type NoteEntry,
  type NoteReply,
} from '../components/NoteModals';
import NewNoteModal from "../components/NewNoteModal";

const TYPEICON: Record<string, string> = {
  control: '🩺', observacion: '👁', emergencia: '🚨',
  vacuna: '💉', cirugia: '🔪', otro: '📝',
};

const TYPEBG: Record<string, string> = {
  control: 'var(--blue-hl)', observacion: 'var(--primary-hl)', emergencia: 'var(--err-hl)',
  vacuna: 'var(--success-hl)', cirugia: 'var(--warn-hl)', otro: 'var(--surface-offset)',
};

const TYPEFG: Record<string, string> = {
  control: 'var(--blue)', observacion: 'var(--primary)', emergencia: 'var(--err)',
  vacuna: 'var(--success)', cirugia: 'var(--warn)', otro: 'var(--text-muted)',
};

function NoteCard({ note, onClick }: { note: NoteEntry; onClick: () => void }) {
  const { t, i18n } = useTranslation();
  const icon = TYPEICON[note.type] ?? '📝';
  const bg = TYPEBG[note.type] ?? 'var(--surface-offset)';
  const fg = TYPEFG[note.type] ?? 'var(--text-muted)';
  const lbl = t(`notes.typeOptions.${note.type}` as never, { defaultValue: note.type });
  const dateStr = new Date(`${note.date}T12:00:00`).toLocaleDateString(i18n.language, {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="note-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      style={{ cursor: 'pointer', borderRadius: 'var(--r-xl)', background: 'var(--surface)',
               border: '1.5px solid var(--border)', padding: '1.125rem', boxShadow: 'var(--sh-sm)',
               display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--r-lg)', background: bg,
                      color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: '.875rem', color: 'var(--text)', lineHeight: 1.2 }}>
            {lbl}
          </div>
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
            {note.vet ? `${note.vet} · ` : ''}{dateStr}
          </div>
        </div>
        {note.archived && (
          <span className="badge badge-gray" style={{ fontSize: '.6rem' }}>
            {t('notes.archivedBadge')}
          </span>
        )}
      </div>
      <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden', margin: 0 }}>
        {note.content}
      </p>
      {(note.replies?.length ?? 0) > 0 && (
        <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', fontWeight: 600 }}>
          💬 {note.replies!.length} {note.replies!.length === 1
            ? t('notes.replySingular', { count: 1 })
            : t('notes.replyPlural', { count: note.replies!.length })}
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const { pets } = usePetsContext();
  const { notes, loading, addNote, updateNote, archiveNote, unarchiveNote, deleteNote, addReply } = useNotes();

  const [addOpen, setAddOpen] = useState(false);
  const [detailNote, setDetailNote] = useState<NoteEntry | null>(null);
  const [editNote, setEditNote] = useState<NoteEntry | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const active = useMemo(() => notes.filter((n) => !n.archived), [notes]);
  const archived = useMemo(() => notes.filter((n) => n.archived), [notes]);

  const handleAdd = (d: {
    petId: string; content: string; vet: string; date: string; type: string;
  }) => {
    const pet = pets.find((p) => p.id === d.petId) ?? null;
    if (!pet) { console.error('Pet not found'); return; }
    const newNote: NoteEntry = {
      ...d,
      id: `n-${Date.now()}`,
      archived: false,
      replies: [],
      authorId: user?.email ?? '',
      authorName: user?.name ?? t('pet.share.badgeYou'),
      authorAvatar: user?.avatar ?? user?.name?.slice(0, 2).toUpperCase() ?? 'YU',
      authorColor: user?.color ?? 'var(--primary-hl)',
      authorColorFg: user?.colorFg ?? 'var(--primary)',
    };
    addNote(newNote);
    showToast(t('pet.notes.toastAdded'));
  };

  const handleSaveEdit = (updated: NoteEntry) => {
    updateNote(updated);
    showToast(t('pet.notes.toastUpdated', { defaultValue: 'Nota actualizada' }));
  };

  const handleArchive = (id: string) => {
    archiveNote(id);
    showToast(t('toast.noteArchived', { defaultValue: 'Nota arquivada' }));
  };

  const handleUnarchive = (id: string) => {
    unarchiveNote(id);
    showToast(t('toast.noteUnarchived', { defaultValue: 'Nota restaurada' }));
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    setDetailNote((prev) => (prev?.id === id ? null : prev));
    setEditNote((prev) => (prev?.id === id ? null : prev));
    showToast(t('toast.noteDeleted', { defaultValue: 'Nota eliminada' }));
  };

  const handleAddReply = (noteId: string, reply: NoteReply) => {
    addReply(noteId, reply);
    setDetailNote((prev) =>
      prev?.id === noteId ? { ...prev, replies: [...(prev.replies ?? []), reply] } : prev,
    );
  };

  if (loading) {
    return (
      <div>
        <BackButton />
        <div className="page-loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (!pets.length) {
    return (
      <div>
        <BackButton />
        <div className="page-header">
          <div><div className="page-title">{t('notes.title')}</div><div className="page-subtitle">{t('notes.subtitle')}</div></div>
        </div>
        <div className="page-empty">{t('pets.noPets')}</div>
      </div>
    );
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
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('notes.new')}
        </button>
      </div>

      {active.length === 0 && archived.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
          <div className="empty-state-icon" style={{ fontSize: '2.5rem' }}>📝</div>
          <h3>{t('notes.emptyTitle', { defaultValue: 'Sem notas ainda' })}</h3>
          <p>{t('notes.emptyText', { defaultValue: 'Adicione notas clínicas, observações ou lembretes.' })}</p>
          <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
            {t('notes.new')}
          </button>
        </div>
      ) : (
        <div>
          {/* Notas activas */}
          <div className="grid-auto" style={{ marginBottom: '2rem' }}>
            {active.map((n) => (
              <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} />
            ))}
            <div className="note-add-card" onClick={() => setAddOpen(true)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setAddOpen(true); }}>
              <div className="note-add-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
          </div>

          {/* Notas arquivadas */}
          {archived.length > 0 && (
            <div>
              <div style={{ fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase',
                            letterSpacing: '.07em', color: 'var(--text-faint)', marginBottom: '.875rem' }}>
                {t('notes.archivedBadge')} ({archived.length})
              </div>
              <div className="grid-auto">
                {archived.map((n) => (
                  <NoteCard key={n.id} note={n} onClick={() => setDetailNote(n)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      {addOpen && (
        <NewNoteModal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={handleAdd}
        />
      )}

      <NoteDetailModal
        note={detailNote}
        onClose={() => setDetailNote(null)}
        onEdit={(n) => { setDetailNote(null); setEditNote(n); setEditOpen(true); }}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
        onAddReply={handleAddReply}
      />

      <EditNoteModal
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setEditNote(null); }}
        note={editNote}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
