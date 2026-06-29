import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { petsApi } from '../api'
import type { CreatePetDto, UpdatePetDto } from '../api'
import { useUser } from './UserContext'

export interface Pet {
  id: string
  name: string
  species: string
  breed?: string | null
  birthDate?: string | null
  photoUrl?: string | null
  color?: string | null
  microchip?: string | null
  passport?: string | null
  ownerId: string
  createdAt?: string
}

interface PetsContextValue {
  pets: Pet[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addPet: (data: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => Promise<Pet>
  updatePet: (id: string, data: Partial<Pet>) => Promise<Pet>
  deletePet: (id: string) => Promise<void>
}

const PetsContext = createContext<PetsContextValue | null>(null)

export function PetsProvider({ children }: { children: React.ReactNode }) {
  // FIX: incluir `ready` para nao chamar a API antes do UserContext ter lido o localStorage
  const { user, isAuthenticated, ready } = useUser()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    // FIX: aguardar ready AND isAuthenticated AND user.id com valor real
    if (!ready || !isAuthenticated || !user.id) return
    setLoading(true)
    setError(null)
    try {
      const res = await petsApi.getAll(user.id)
      setPets(res.data as unknown as Pet[])
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar pets')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user.id, ready])

  useEffect(() => {
    if (ready && isAuthenticated && user.id) {
      refresh()
    } else if (ready && !isAuthenticated) {
      // utilizador deslogado: limpar
      setPets([])
    }
  }, [isAuthenticated, user.id, ready, refresh])

  const addPet = async (data: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>): Promise<Pet> => {
    const res = await petsApi.create({ ...data, ownerId: user.id } as CreatePetDto)
    const p = res.data as unknown as Pet
    setPets(prev => [p, ...prev])
    return p
  }

  const updatePet = async (id: string, data: Partial<Pet>): Promise<Pet> => {
    const res = await petsApi.update(id, data as UpdatePetDto)
    const u = res.data as unknown as Pet
    setPets(prev => prev.map(p => (p.id === id ? u : p)))
    return u
  }

  const deletePet = async (id: string): Promise<void> => {
    await petsApi.delete(id)
    setPets(prev => prev.filter(p => p.id !== id))
  }

  return (
    <PetsContext.Provider value={{ pets, loading, error, refresh, addPet, updatePet, deletePet }}>
      {children}
    </PetsContext.Provider>
  )
}

export function usePetsContext(): PetsContextValue {
  const ctx = useContext(PetsContext)
  if (!ctx) throw new Error('usePetsContext must be used within PetsProvider')
  return ctx
}

// Alias para compatibilidade
export { usePetsContext as usePets }
