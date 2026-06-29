import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Species } from '../types'
import type { PetWithAlerts } from '../hooks/usePets'
import { petsApi } from '../api'
import { useUser } from './UserContext'

export type Theme = 'light' | 'dark'

export type CreatePetInput = {
  name: string
  species: Species
  breed?: string
  birthDate?: string
  weightKg?: number
}

export interface PitutiState {
  pets: PetWithAlerts[]
  petsLoading: boolean
  petsError: string | null
  theme: Theme
  toastMessage: string
  toastType: 'success' | 'err'
  toastVisible: boolean
}

type Action =
  | { type: 'SET_PETS'; payload: PetWithAlerts[] }
  | { type: 'SET_PETS_LOADING'; payload: boolean }
  | { type: 'SET_PETS_ERROR'; payload: string | null }
  | { type: 'ADD_PET'; payload: PetWithAlerts }
  | { type: 'REMOVE_PET'; payload: string }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SHOW_TOAST'; payload: { message: string; kind: 'success' | 'err' } }
  | { type: 'HIDE_TOAST' }

const initialState: PitutiState = {
  pets: [],
  petsLoading: true,
  petsError: null,
  theme: (localStorage.getItem('pituti-theme') as Theme) ?? 'light',
  toastMessage: '',
  toastType: 'success',
  toastVisible: false,
}

function reducer(state: PitutiState, action: Action): PitutiState {
  switch (action.type) {
    case 'SET_PETS':         return { ...state, pets: action.payload }
    case 'SET_PETS_LOADING': return { ...state, petsLoading: action.payload }
    case 'SET_PETS_ERROR':   return { ...state, petsError: action.payload }
    case 'ADD_PET':         return { ...state, pets: [action.payload, ...state.pets] }
    case 'REMOVE_PET':      return { ...state, pets: state.pets.filter(p => p.id !== action.payload) }
    case 'SET_THEME':       return { ...state, theme: action.payload }
    case 'SHOW_TOAST':      return { ...state, toastMessage: action.payload.message, toastType: action.payload.kind, toastVisible: true }
    case 'HIDE_TOAST':      return { ...state, toastVisible: false }
    default:                return state
  }
}

interface PitutiContextValue {
  state: PitutiState
  addPet: (data: CreatePetInput) => Promise<PetWithAlerts>
  removePet: (id: string) => void
  refetchPets: () => void
  toggleTheme: () => void
  showToast: (message: string, kind?: 'success' | 'err') => void
  hideToast: () => void
}

const PitutiContext = createContext<PitutiContextValue | null>(null)

function mapApiPetToPetWithAlerts(apiPet: any): PetWithAlerts {
  return { ...apiPet, alerts: [], vaccCoverage: 100 }
}

export function PitutiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  // FIX: incluir `ready` para garantir que o UserContext já leu o localStorage
  const { user, ready } = useUser()

  const loadPets = useCallback((ownerId: string) => {
    // FIX: validação explícita de ownerId — evita GET /api/pets?ownerId= (HTTP 400)
    if (!ownerId || !ownerId.trim()) return
    dispatch({ type: 'SET_PETS_LOADING', payload: true })
    dispatch({ type: 'SET_PETS_ERROR', payload: null })
    petsApi
      .getAll(ownerId)
      .then(res => {
        const pets = Array.isArray(res.data) ? res.data.map(mapApiPetToPetWithAlerts) : []
        dispatch({ type: 'SET_PETS', payload: pets })
        dispatch({ type: 'SET_PETS_LOADING', payload: false })
      })
      .catch((err: unknown) => {
        dispatch({ type: 'SET_PETS', payload: [] })
        const message = err instanceof Error ? err.message : String(err)
        dispatch({ type: 'SET_PETS_ERROR', payload: message ?? null })
        dispatch({ type: 'SET_PETS_LOADING', payload: false })
      })
  }, [])

  // FIX: `ready` garante que user.id tem o valor real do localStorage antes de chamar a API
  useEffect(() => {
    if (!ready) return
    loadPets(user.id)
  }, [loadPets, user.id, ready])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('pituti-theme', state.theme)
  }, [state.theme])

  useEffect(() => {
    if (!state.toastVisible) return
    const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3200)
    return () => clearTimeout(t)
  }, [state.toastVisible, state.toastMessage])

  const addPet = useCallback(async (data: CreatePetInput) => {
    const res = await petsApi.create({
      name: data.name,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate,
      ownerId: user.id,
    })
    const createdPet = mapApiPetToPetWithAlerts(res.data)
    dispatch({ type: 'ADD_PET', payload: createdPet })
    return createdPet
  }, [user.id])

  const removePet = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_PET', payload: id })
  }, [])

  const refetchPets = useCallback(() => loadPets(user.id), [loadPets, user.id])

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })
  }, [state.theme])

  const showToast = useCallback((message: string, kind: 'success' | 'err' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, kind } })
  }, [])

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' })
  }, [])

  return (
    <PitutiContext.Provider value={{ state, addPet, removePet, refetchPets, toggleTheme, showToast, hideToast }}>
      {children}
    </PitutiContext.Provider>
  )
}

export function usePituti() {
  const ctx = useContext(PitutiContext)
  if (!ctx) throw new Error('usePituti deve ser usado dentro de PitutiProvider')
  return ctx
}

export const usePets = () => {
  const { state, refetchPets } = usePituti()
  return { pets: state.pets, loading: state.petsLoading, error: state.petsError, refetch: refetchPets }
}

export const useTheme = () => {
  const { state, toggleTheme } = usePituti()
  return { theme: state.theme, toggleTheme }
}

export const useAppToast = () => {
  const { showToast } = usePituti()
  return showToast
}
