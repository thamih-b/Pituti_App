import {
  createContext, useContext,
  useState, useCallback, useEffect,
  type ReactNode,
} from 'react'
import { petsApi } from '../api'

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

// Mantido aqui — usado como tipo en VaccineDetailModal, EditVaccineModal, RegisterVaccineModal
export interface VaccineRecord {
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
  const [pets,    setPets]    = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  // Carga inicial de mascotas desde la API
  useEffect(() => {
    petsApi.getAll()
      .then(res => setPets(res.data as unknown as Pet[]))
      .catch(() => { /* silencioso — pets queda vacío si la API no responde */ })
      .finally(() => setLoading(false))
  }, [])

  const addPet    = useCallback((pet: Pet) =>
    setPets(prev => [...prev, pet]), [])

  const updatePet = useCallback((pet: Pet) =>
    setPets(prev => prev.map(p => p.id === pet.id ? pet : p)), [])

  const removePet = useCallback((id: string) =>
    setPets(prev => prev.filter(p => p.id !== id)), [])

  return (
    <PetsContext.Provider value={{ pets, loading, addPet, updatePet, removePet }}>
      {children}
    </PetsContext.Provider>
  )
}

export function usePetsContext() {
  const ctx = useContext(PetsContext)
  if (!ctx) throw new Error('usePetsContext must be used inside PetsProvider')
  return ctx
}
