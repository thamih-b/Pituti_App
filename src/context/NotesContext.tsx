// src/context/NotesContext.tsx
// Cloud-sync: localStorage imediato + API em background.
// Campos locais (archived, replies, authorInfo) mesclados sobre os dados da API.
import React, {
  createContext, useContext, useState, useCallback, useEffect, useMemo,
} from 'react'
import { petsApi, notesApi } from '../api'
import type { ApiNote } from '../api'
import { useUser } from './UserContext'
import type { NoteEntry, NoteReply } from '../components/NoteModals'

export type { NoteEntry, NoteReply }

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY = (uid: string) => `pituti-notes-${uid}`

function loadNotes(userId: string): NoteEntry[] {
  if (!userId) return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY(userId)) ?? 'null') ?? [] }
  catch { return [] }
}

function saveNotes(userId: string, notes: NoteEntry[]): void {
  if (!userId) return
  try { localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(notes)) }
  catch { /* quota */ }
}

// ── Mapper API → NoteEntry ────────────────────────────────────────────────────
// archived, replies e authorInfo são campos locais — não existem na API.
// Ao carregar da API, mesclamos com o que temos em localStorage.

function apiToEntry(api: ApiNote, local?: NoteEntry): NoteEntry {
  return {
    id:            api.id,
    petId:         api.petId,
    type:          api.type,
    content:       api.content,
    date:          api.date ?? new Date().toISOString().split('T')[0],
    vet:           api.vet ?? '',
    archived:      local?.archived       ?? false,
    replies:       local?.replies         ?? [],
    authorId:      local?.authorId        ?? '',
    authorName:    local?.authorName      ?? '',
    authorAvatar:  local?.authorAvatar    ?? '',
    authorColor:   local?.authorColor     ?? 'var(--primary-hl)',
    authorColorFg: local?.authorColorFg   ?? 'var(--primary)',
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface NotesContextValue {
  notes:        NoteEntry[]
  loading:      boolean
  addNote:      (note: NoteEntry) => void
  updateNote:   (updated: NoteEntry) => void
  archiveNote:  (id: string) => void
  unarchiveNote:(id: string) => void
  deleteNote:   (id: string) => void
  addReply:     (noteId: string, reply: NoteReply) => void
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, ready } = useUser()
  const [notes, setNotesRaw] = useState<NoteEntry[]>([])
  const [loading, setLoading]  = useState(true)

  // Helper: actualiza estado e localStorage atomicamente
  const setNotes = useCallback(
    (updater: (prev: NoteEntry[]) => NoteEntry[]) => {
      setNotesRaw(prev => {
        const next = updater(prev)
        if (user.id) saveNotes(user.id, next)
        return next
      })
    },
    [user.id],
  )

  // ── Carregamento ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !isAuthenticated || !user.id) {
      setNotesRaw([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    // 1. localStorage imediato (exibição instantânea)
    const stored = loadNotes(user.id)
    if (stored.length) setNotesRaw(stored)

    // 2. API em background — mesma estratégia de MedicationsContext
    petsApi
      .getAll(user.id)
      .then(async petsRes => {
        const pets = petsRes.data as any[]
        const results = await Promise.all(
          pets.map(p =>
            notesApi
              .getAll(p.id)
              .then(r =>
                r.data.map(n => {
                  const local = stored.find(s => s.id === n.id)
                  return apiToEntry(n, local)
                })
              )
              .catch(() => [] as NoteEntry[]),
          ),
        )
        if (!cancelled) {
          const apiNotes = results.flat()
          if (apiNotes.length) {
            // Mantém notas locais que ainda não foram sincronizadas
            const localOnlyNotes = stored.filter(
              s => s.id.startsWith('n-') && !apiNotes.find(a => a.id === s.id),
            )
            const merged = [...apiNotes, ...localOnlyNotes]
            setNotesRaw(merged)
            saveNotes(user.id, merged)
          }
          setLoading(false)
        }
      })
      .catch(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [ready, isAuthenticated, user.id])

  // ── Operações ─────────────────────────────────────────────────────────────────

  const addNote = useCallback(
    (note: NoteEntry) => {
      // 1. Optimistic update local
      setNotes(prev => [note, ...prev])

      // 2. Persiste na API
      if (!note.petId) return
      notesApi
        .create(note.petId, {
          type:    note.type,
          content: note.content,
          date:    note.date,
          vet:     note.vet || undefined,
        })
        .then(res => {
          // Substitui ID local pelo UUID real do servidor
          setNotes(prev =>
            prev.map(n => n.id === note.id ? { ...n, id: res.data.id } : n),
          )
        })
        .catch(() => { /* mantém ID local */ })
    },
    [setNotes],
  )

  const updateNote = useCallback(
    (updated: NoteEntry) => {
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))

      // Envia à API se o ID não for local
      if (updated.petId && !updated.id.startsWith('n-')) {
        notesApi
          .update(updated.petId, updated.id, {
            type:    updated.type,
            content: updated.content,
            date:    updated.date,
            vet:     updated.vet || undefined,
          })
          .catch(() => { /* silencia */ })
      }
    },
    [setNotes],
  )

  const archiveNote = useCallback(
    (id: string) =>
      setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n)),
    [setNotes],
  )

  const unarchiveNote = useCallback(
    (id: string) =>
      setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: false } : n)),
    [setNotes],
  )

  const deleteNote = useCallback(
    (id: string) => {
      const note = notes.find(n => n.id === id)
      setNotes(prev => prev.filter(n => n.id !== id))
      // Deleta na API se não for ID local
      if (note?.petId && !id.startsWith('n-')) {
        notesApi.delete(note.petId, id).catch(() => { /* silencia */ })
      }
    },
    [notes, setNotes],
  )

  const addReply = useCallback(
    (noteId: string, reply: NoteReply) =>
      setNotes(prev =>
        prev.map(n =>
          n.id === noteId
            ? { ...n, replies: [...(n.replies ?? []), reply] }
            : n,
        ),
      ),
    [setNotes],
  )

  const value = useMemo(
    () => ({ notes, loading, addNote, updateNote, archiveNote, unarchiveNote, deleteNote, addReply }),
    [notes, loading, addNote, updateNote, archiveNote, unarchiveNote, deleteNote, addReply],
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
