import { useCallback, useEffect, useState } from 'react'
import type { Pet, PetAlert, Species } from '../types'

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface PetWithAlerts extends Pet {
  alerts: PetAlert[]
  healthScore: number
  vaccCoverage: number   // % baseado só nas vacinas 'ok' (não vencidas, não próximas)
}

interface UsePetsResult {
  pets: PetWithAlerts[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  addPet: (pet: PetWithAlerts) => void
  removePet: (petId: string) => void
}

export interface VaccineRecord {
  name:     string
  applied:  string
  nextDate: string   // ISO yyyy-mm-dd
  badge:    string
  badgeCls: string
}

// ── Constante: dias até vencer para considerar "soon" ────────────────────────
const WARN_DAYS = 30

// ── Helper: calcula o status da vacina em runtime ────────────────────────────
export function getVaccStatus(nextDate: string): 'ok' | 'soon' | 'late' {
  const d     = new Date(nextDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const delta = Math.floor((d.getTime() - today.getTime()) / 86_400_000)
  if (delta < 0)           return 'late'
  if (delta <= WARN_DAYS)  return 'soon'
  return 'ok'
}

// ── VACCINES_BY_PET ───────────────────────────────────────────────────────────
// cls é calculado em runtime via getVaccStatus — não hardcodado aqui
export const VACCINES_BY_PET: Record<string, VaccineRecord[]> = {
  'pet-1': [
    { name: 'Antirrábica',       applied: '15 abr 2024', nextDate: '2026-04-23', badge: 'URGENTE',    badgeCls: 'badge-red'    },
    { name: 'Trivalente felina', applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',     badgeCls: 'badge-green'  },
    { name: 'Leucemia felina',   applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',     badgeCls: 'badge-green'  },
    { name: 'Calicivirus',       applied: '03 mar 2025', nextDate: '2026-06-01', badge: 'EN 2 MESES', badgeCls: 'badge-yellow' },
  ],
  'pet-2': [
    { name: 'Rabia canina',  applied: '10 mar 2025', nextDate: '2026-03-10', badge: 'VENCIDA',  badgeCls: 'badge-red'    },
    { name: 'Moquillo',      applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',   badgeCls: 'badge-green'  },
    { name: 'Parvovirus',    applied: '10 ene 2026', nextDate: '2027-01-10', badge: 'AL DÍA',   badgeCls: 'badge-green'  },
    { name: 'Leptospirosis', applied: '05 feb 2026', nextDate: '2026-05-15', badge: 'EN 1 MES', badgeCls: 'badge-yellow' },
  ],
  'pet-3': [
    { name: 'Newcastle',     applied: '01 feb 2026', nextDate: '2027-02-01', badge: 'AL DÍA', badgeCls: 'badge-green' },
    { name: 'Viruela aviar', applied: '01 feb 2026', nextDate: '2027-02-01', badge: 'AL DÍA', badgeCls: 'badge-green' },
  ],
}

// ── calcVaccCoverage: conta só as 'ok' (não vencidas, não próximas) ───────────
function calcVaccCoverage(petId: string): number {
  const vaccines = VACCINES_BY_PET[petId] ?? []
  if (vaccines.length === 0) return 100
  const ok = vaccines.filter(v => getVaccStatus(v.nextDate) === 'ok').length
  return Math.round((ok / vaccines.length) * 100)
}

// ── MOCK_PETS ─────────────────────────────────────────────────────────────────
export const MOCK_PETS: PetWithAlerts[] = [
  {
    id: 'pet-1', name: 'Luna', species: 'cat' as Species,
    breed: 'Europeo común', birthDate: '2021-05-14',
    photoUrl: '', ownerId: 'user-1', createdAt: '2026-04-01T10:00:00.000Z',
    healthScore: 75, vaccCoverage: calcVaccCoverage('pet-1'),
    alerts: [{ type: 'warn', text: 'Vacuna antirrábica vence en 3 días' }],
  },
  {
    id: 'pet-2', name: 'Toby', species: 'dog' as Species,
    breed: 'Mestizo', birthDate: '2020-10-01',
    photoUrl: '', ownerId: 'user-1', createdAt: '2026-04-02T10:00:00.000Z',
    healthScore: 60, vaccCoverage: calcVaccCoverage('pet-2'),
    alerts: [{ type: 'err', text: '1 Síntoma bajo observación — tos suave' }],
  },
  {
    id: 'pet-3', name: 'Kiwi', species: 'bird' as Species,
    breed: 'Periquito', birthDate: '2023-02-18',
    photoUrl: '', ownerId: 'user-1', createdAt: '2026-04-03T10:00:00.000Z',
    healthScore: 95, vaccCoverage: calcVaccCoverage('pet-3'),
    alerts: [],
  },
]

// ── Constantes ────────────────────────────────────────────────────────────────
export const PALETTE_COLORS = ['#CCA1C9', '#FFD3DD', '#F3A0AD', '#BED1E3', '#92A1C3']

export const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🦜', rabbit: '🐰',
  reptile: '🦎', fish: '🐟', other: '🐾',
}

// ── usePets hook ──────────────────────────────────────────────────────────────
export function usePets(): UsePetsResult {
  const [pets,    setPets]    = useState<PetWithAlerts[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      setPets(MOCK_PETS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPet    = useCallback((pet: PetWithAlerts) => setPets(prev => [pet, ...prev]), [])
  const removePet = useCallback((petId: string)       => setPets(prev => prev.filter(p => p.id !== petId)), [])

  useEffect(() => { reload() }, [reload])

  return { pets, loading, error, reload, addPet, removePet }
}
