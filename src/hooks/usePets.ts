import { useCallback, useEffect, useState } from 'react'
import type { Pet, PetAlert } from '../types'

export interface PetWithAlerts extends Pet {
  alerts: PetAlert[]
  healthScore: number
}

interface UsePetsResult {
  pets: PetWithAlerts[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  addPet: (pet: PetWithAlerts) => void
  removePet: (petId: string) => void
}

export const MOCK_PETS: PetWithAlerts[] = [
  {
    id: 'pet-1',
    name: 'Luna',
    species: 'cat',
    breed: 'Europeo común',
    birthDate: '2021-05-14',
    photoUrl: '',
    ownerId: 'user-1',
    createdAt: '2026-04-01T10:00:00.000Z',
    healthScore: 75,
    alerts: [
      { type: 'warn', text: 'Vacuna antirrábica vence en 3 días' },
    ],
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
    healthScore: 60,
    alerts: [
      { type: 'err', text: '1 Síntoma bajo observación — tos suave' },
    ],
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
    healthScore: 95,
    alerts: [],
  },
]

export const PALETTE_COLORS = [
  '#CCA1C9',
  '#FFD3DD',
  '#F3A0AD',
  '#BED1E3',
  '#92A1C3',
]

export const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  bird: '🦜',
  rabbit: '🐰',
  reptile: '🦎',
  fish: '🐟',
  other: '🐾',
}

export function usePets(): UsePetsResult {
  const [pets, setPets] = useState<PetWithAlerts[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      setPets(MOCK_PETS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPet = useCallback((pet: PetWithAlerts) => {
    setPets((prev) => [pet, ...prev])
  }, [])

  const removePet = useCallback((petId: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== petId))
  }, [])

  useEffect(() => { reload() }, [reload])

  return { pets, loading, error, reload, addPet, removePet }
}
