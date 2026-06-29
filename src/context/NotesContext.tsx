// NotesContext.tsx - Persiste notas em localStorage por userId
import React, {
  createContext, useContext, useState, useCallback, useEffect, useMemo,
} from 'react';
import { useUser } from './UserContext';
import type { NoteEntry, NoteReply } from '../components/NoteModals';

export type { NoteEntry, NoteReply };

interface NotesContextValue {
  notes: NoteEntry[];
  loading: boolean;
  addNote: (note: NoteEntry) => void;
  updateNote: (updated: NoteEntry) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;
  deleteNote: (id: string) => void;
  addReply: (noteId: string, reply: NoteReply) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

const STORAGE_KEY = (userId: string) => `pituti-notes-${userId}`;

function loadNotes(userId: string): NoteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(userId: string, notes: NoteEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(notes));
  } catch {
    // ignore quota errors
  }
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUser();
  const [notes, setNotesState] = useState<NoteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega do localStorage quando o utilizador autentica
  useEffect(() => {
    if (!isAuthenticated || !user.id) {
      setNotesState([]);
      setLoading(false);
      return;
    }
    const stored = loadNotes(user.id);
    setNotesState(stored);
    setLoading(false);
  }, [isAuthenticated, user.id]);

  // Helper para actualizar state + localStorage atomicamente
  const setNotes = useCallback(
    (updater: (prev: NoteEntry[]) => NoteEntry[]) => {
      setNotesState((prev) => {
        const next = updater(prev);
        if (user.id) saveNotes(user.id, next);
        return next;
      });
    },
    [user.id],
  );

  const addNote = useCallback(
    (note: NoteEntry) => {
      setNotes((prev) => [note, ...prev]);
    },
    [setNotes],
  );

  const updateNote = useCallback(
    (updated: NoteEntry) => {
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    },
    [setNotes],
  );

  const archiveNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, archived: true } : n)));
    },
    [setNotes],
  );

  const unarchiveNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, archived: false } : n)));
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes],
  );

  const addReply = useCallback(
    (noteId: string, reply: NoteReply) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, replies: [...(n.replies ?? []), reply] } : n,
        ),
      );
    },
    [setNotes],
  );

  const value = useMemo(
    () => ({ notes, loading, addNote, updateNote, archiveNote, unarchiveNote, deleteNote, addReply }),
    [notes, loading, addNote, updateNote, archiveNote, unarchiveNote, deleteNote, addReply],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
