import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react'
import type { PetWithAlerts } from '../hooks/usePets'
import { MOCK_PETS } from '../hooks/usePets'

// ── Tipos ────────────────────────────────────────────────────────────────────

export type Theme = 'light' | 'dark'

export interface CareEntry {
  id: string        // ex: "pet-1_food"
  petId: string
  emoji: string
  label: string
  total: number
  done: number
}

export interface PitutiState {
  // Mascotas
  pets: PetWithAlerts[]
  petsLoading: boolean
  // Tema
  theme: Theme
  // Alertas globais
  toastMessage: string
  toastType: 'success' | 'err'
  toastVisible: boolean
  // Cuidados do dia
  cares: CareEntry[]
}

// ── Acciones ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_PETS'; payload: PetWithAlerts[] }
  | { type: 'SET_PETS_LOADING'; payload: boolean }
  | { type: 'ADD_PET'; payload: PetWithAlerts }
  | { type: 'REMOVE_PET'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SHOW_TOAST'; payload: { message: string; kind: 'success' | 'err' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_CARE_DONE'; payload: { id: string; done: number } }
  | { type: 'SET_CARES'; payload: CareEntry[] }

// ── Estado inicial ────────────────────────────────────────────────────────────

const DEFAULT_CARES: CareEntry[] = [
  { id: 'pet-1_food',   petId: 'pet-1', emoji: '🍽️', label: 'Luna · comida',    total: 2, done: 0 },
  { id: 'pet-2_water',  petId: 'pet-2', emoji: '💧', label: 'Toby · agua',      total: 3, done: 2 },
  { id: 'pet-2_walk',   petId: 'pet-2', emoji: '🏃', label: 'Toby · paseo',     total: 2, done: 0 },
  { id: 'pet-3_water',  petId: 'pet-3', emoji: '💧', label: 'Kiwi · agua',      total: 2, done: 2 },
  { id: 'pet-1_brush',  petId: 'pet-1', emoji: '✂️', label: 'Luna · cepillado', total: 1, done: 0 },
  { id: 'pet-1_water',  petId: 'pet-1', emoji: '💧', label: 'Luna · agua',      total: 2, done: 1 },
]

const initialState: PitutiState = {
  pets: [],
  petsLoading: true,
  theme: (localStorage.getItem('pituti-theme') as Theme) ?? 'light',
  toastMessage: '',
  toastType: 'success',
  toastVisible: false,
  cares: DEFAULT_CARES,
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: PitutiState, action: Action): PitutiState {
  switch (action.type) {
    case 'SET_PETS':
      return { ...state, pets: action.payload }
    case 'SET_PETS_LOADING':
      return { ...state, petsLoading: action.payload }
    case 'ADD_PET':
      return { ...state, pets: [action.payload, ...state.pets] }
    case 'REMOVE_PET':
      return { ...state, pets: state.pets.filter(p => p.id !== action.payload) }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload.message, toastType: action.payload.kind, toastVisible: true }
    case 'HIDE_TOAST':
      return { ...state, toastVisible: false }
    case 'SET_CARE_DONE':
      return {
        ...state,
        cares: state.cares.map(c =>
          c.id === action.payload.id ? { ...c, done: action.payload.done } : c
        ),
      }
    case 'SET_CARES':
      return { ...state, cares: action.payload }
    default:
      return state
  }
}

// ── Contexto ──────────────────────────────────────────────────────────────────

interface PitutiContextValue {
  state: PitutiState
  // Mascotas
  addPet: (pet: PetWithAlerts) => void
  removePet: (id: string) => void
  // Tema
  toggleTheme: () => void
  // Toast
  showToast: (message: string, kind?: 'success' | 'err') => void
  hideToast: () => void
  // Cuidados
  setCaredone: (id: string, done: number) => void
}

const PitutiContext = createContext<PitutiContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function PitutiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Carregar pets ao montar
  useEffect(() => {
    dispatch({ type: 'SET_PETS_LOADING', payload: true })
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_PETS', payload: MOCK_PETS })
      dispatch({ type: 'SET_PETS_LOADING', payload: false })
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Sincronizar tema com DOM e localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('pituti-theme', state.theme)
  }, [state.theme])

  // Auto-ocultar toast após 3.2 s
  useEffect(() => {
    if (!state.toastVisible) return
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3200)
    return () => clearTimeout(t)
  }, [state.toastVisible, state.toastMessage])

  const addPet    = useCallback((pet: PetWithAlerts) => dispatch({ type: 'ADD_PET', payload: pet }), [])
  const removePet = useCallback((id: string) => dispatch({ type: 'REMOVE_PET', payload: id }), [])

  const toggleTheme = useCallback(() =>
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' }), [state.theme])

  const showToast = useCallback((message: string, kind: 'success' | 'err' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, kind } })
  }, [])

  const setCaredone = useCallback((id: string, done: number) =>
    dispatch({ type: 'SET_CARE_DONE', payload: { id, done } }), [])

  const hideToast = useCallback(() => dispatch({ type: 'HIDE_TOAST' }), [])

  return (
    <PitutiContext.Provider value={{ state, addPet, removePet, toggleTheme, showToast, hideToast, setCaredone }}>
      {children}
    </PitutiContext.Provider>
  )
}

// ── Hook de consumo ───────────────────────────────────────────────────────────

export function usePituti() {
  const ctx = useContext(PitutiContext)
  if (!ctx) throw new Error('usePituti deve ser usado dentro de <PitutiProvider>')
  return ctx
}

// Atalhos convenientes
export const usePets       = () => { const { state } = usePituti(); return { pets: state.pets, loading: state.petsLoading } }
export const useTheme      = () => { const { state, toggleTheme } = usePituti(); return { theme: state.theme, toggleTheme } }
export const useCares      = () => { const { state, setCaredone } = usePituti(); return { cares: state.cares, setCaredone } }
export const useAppToast   = () => { const { showToast } = usePituti(); return showToast }