import { useCallback, useEffect, useState } from 'react'
import type { Pet } from '../types'

interface UsePetsResult {
  pets: Pet[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  addPet: (pet: Pet) => void
  removePet: (petId: string) => void
}

const MOCK_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Luna',
    species: 'cat',
    breed: 'Europeo común',
    birthDate: '2021-05-14',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-01T10:00:00.000Z',
  },
  {
    id: 'pet-2',
    name: 'Toby',
    species: 'dog',
    breed: 'Mestizo',
    birthDate: '2020-10-01',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-02T10:00:00.000Z',
  },
  {
    id: 'pet-3',
    name: 'Kiwi',
    species: 'bird',
    breed: 'Periquito',
    birthDate: '2023-02-18',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-03T10:00:00.000Z',
  },
]

export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setPets(MOCK_PETS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPet = useCallback((pet: Pet) => {
    setPets((prev) => [pet, ...prev])
  }, [])

  const removePet = useCallback((petId: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== petId))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { pets, loading, error, reload, addPet, removePet }
}