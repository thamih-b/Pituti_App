// traduzido e sem mock

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord }  from '../components/EditMedModal'
import { petsApi, medicationsApi } from '../api'
import type { ApiMedication } from '../api'

const PET_SPECIES_EMOJI: Record<string, string> = {
  cat:'🐱', dog:'🐶', bird:'🦜', rabbit:'🐰', reptile:'🦎', fish:'🐟', other:'🐾',
}

function mapApiMed(
  m: ApiMedication & { petId: string; petName?: string; petSpecies?: string }
): MedRecord {
  return {
    id:        m.id,
    icon:      '💊',
    // ✅ título só com nome do medicamento — sem nome da pet embutido
    title:     m.name,
    dose:      m.dosage    ?? '',
    frequency: m.frequency ?? '',
    startDate: m.startDate ?? '',
    endDate:   m.endDate   ?? '',
    notes:     m.notes     ?? '',
    // ✅ petId guardado directamente no MedRecord
    petId:     m.petId,
    bg:        'var(--warn-hl)',
    color:     'var(--warn)',
    // badge e badgeCls calculados pelo estado archived — sem strings ES
    badge:     '',
    badgeCls:  'badge-green',
    archived:  false,
  }
}

type MedicationsContextValue = {
  medications:                 MedRecord[]
  active:                      MedRecord[]
  history:                     MedRecord[]
  loading:                     boolean
  error:                       string | null
  addMedication:               (data: AddMedData) => MedRecord
  updateMedication:            (updated: MedRecord) => void
  deleteMedication:            (id: string) => void
  archiveMedication:           (id: string) => void
  unarchiveMedication:         (id: string) => void
  markMedicationAdministered:  (med: MedRecord, date: string, locale: string) => string
  getMedicationById:           (id: string) => MedRecord | undefined
  getMedicationsByPetId:       (petId: string) => MedRecord[]
  getActiveMedicationsByPetId: (petId: string) => MedRecord[]
}

const MedicationsContext = createContext<MedicationsContextValue | null>(null)

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<MedRecord[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    petsApi.getAll()
      .then(async res => {
        const pets = res.data
        const results = await Promise.all(
          pets.map(p =>
            medicationsApi.getAll(p.id)
              .then(r => r.data.map(m => ({
                ...m,
                petId:      p.id,
                petName:    p.name,
                petSpecies: p.species,
              })))
              .catch(() => [])
          )
        )
        if (cancelled) return
        setMedications(results.flat().map(m => mapApiMed(m as ApiMedication & { petId: string; petName: string; petSpecies: string })))
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          // ✅ mensagem da API — sem hardcode ES
          const msg = err instanceof Error ? err.message : String(err)
          setError(msg || null)
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const active  = useMemo(() => medications.filter(m => !m.archived), [medications])
  const history = useMemo(() => medications.filter(m =>  m.archived), [medications])

  const addMedication = useCallback((data: AddMedData): MedRecord => {
    const petEmoji = PET_SPECIES_EMOJI[data.petSpecies ?? ''] ?? '🐾'
    const newMed: MedRecord = {
      id:        `m-${Date.now()}`,
      icon:      petEmoji,
      // ✅ título limpo — sem nome da pet embutido
      title:     data.name,
      dose:      data.dose,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate:   data.endDate,
      notes:     data.notes,
      // ✅ petId no MedRecord — sem petIdMap externo
      petId:     data.petId,
      bg:        'var(--warn-hl)',
      color:     'var(--warn)',
      badge:     '',
      badgeCls:  'badge-green',
      archived:  false,
    }
    setMedications(prev => [newMed, ...prev])
    return newMed
  }, [])

  const updateMedication = useCallback((u: MedRecord) =>
    setMedications(p => p.map(m => m.id === u.id ? u : m)), [])

  const deleteMedication = useCallback((id: string) =>
    setMedications(p => p.filter(m => m.id !== id)), [])

  // ✅ badge/badgeCls sem strings ES — deixa vazio para ser traduzido no render
  const archiveMedication = useCallback((id: string) =>
    setMedications(p => p.map(m => m.id === id
      ? { ...m, archived: true,  badgeCls: 'badge-gray'  }
      : m
    )), [])

  const unarchiveMedication = useCallback((id: string) =>
    setMedications(p => p.map(m => m.id === id
      ? { ...m, archived: false, badgeCls: 'badge-green' }
      : m
    )), [])

  // ✅ locale passado pelo chamador — sem 'es-ES' hardcoded
  const markMedicationAdministered = useCallback(
    (_med: MedRecord, date: string, locale: string) =>
      new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
    []
  )

  const getMedicationById = useCallback(
    (id: string) => medications.find(m => m.id === id),
    [medications]
  )

  // ✅ usa m.petId directamente — sem petIdMap
  const getMedicationsByPetId = useCallback(
    (petId: string) => medications.filter(m => m.petId === petId),
    [medications]
  )

  const getActiveMedicationsByPetId = useCallback(
    (petId: string) => medications.filter(m => !m.archived && m.petId === petId),
    [medications]
  )

  const value = useMemo(() => ({
    medications, active, history, loading, error,
    addMedication, updateMedication, deleteMedication,
    archiveMedication, unarchiveMedication, markMedicationAdministered,
    getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId,
  }), [
    medications, active, history, loading, error,
    addMedication, updateMedication, deleteMedication,
    archiveMedication, unarchiveMedication, markMedicationAdministered,
    getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId,
  ])

  return <MedicationsContext.Provider value={value}>{children}</MedicationsContext.Provider>
}

export function useMedications() {
  const ctx = useContext(MedicationsContext)
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider')
  return ctx
}