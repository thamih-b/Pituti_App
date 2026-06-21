// src/context/PetsContext.tsx
// PetsContext é agora uma camada fina sobre PitutiContext
// para manter compatibilidade com todos os componentes que usam usePetsContext()
import {
  createContext, useContext, useCallback,
  type ReactNode,
} from 'react'
import { usePituti } from './PitutiContext'

export interface Pet {
  id:         string;
  name:       string;
  species:    string;
  breed?:     string;
  birthDate?: string;
  weightKg?:  number;
  photoUrl?:  string;
  ownerId?:   string;
  createdAt?: string;
}

export interface VaccineRecord {
  id:       string
  name:     string
  applied:  string
  nextDate: string
  badge:    string
  badgeCls: string
}

interface PetsContextValue {
  pets:      Pet[]
  loading:   boolean
  addPet:    (pet: Pet) => void
  updatePet: (pet: Pet) => void
  removePet: (id: string) => void
}

const PetsContext = createContext<PetsContextValue | null>(null)

export function PetsProvider({ children }: { children: ReactNode }) {
  const { state, removePet: removePetFromPituti } = usePituti()

  const addPet    = useCallback((_pet: Pet) => {}, [])
  const updatePet = useCallback((_pet: Pet) => {}, [])
  const removePet = useCallback((id: string) => { removePetFromPituti(id) }, [removePetFromPituti])

  return (
    <PetsContext.Provider value={{
      pets:    state.pets as unknown as Pet[],
      loading: state.petsLoading,
      addPet,
      updatePet,
      removePet,
    }}>
      {children}
    </PetsContext.Provider>
  )
}

export function usePetsContext() {
  const ctx = useContext(PetsContext)
  if (!ctx) throw new Error('usePetsContext must be used inside PetsProvider')
  return ctx
}
