import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord }  from '../components/EditMedModal'
import { petsApi, medicationsApi } from '../api'
import type { ApiMedication } from '../api'

const PET_EMOJI: Record<string, string> = {}
const PET_NAME:  Record<string, string> = {}
const petIdMap = new Map<string, string>()

function inferPetId(med: MedRecord): string | undefined { return petIdMap.get(med.id) }

function mapApiMed(m: ApiMedication & { petName?: string; petSpecies?: string }): MedRecord {
  const species = m.petSpecies === 'cat' ? '🐱' : m.petSpecies === 'dog' ? '🐶' : '🐾'
  const petName = m.petName ?? PET_NAME[m.petId] ?? 'Mascota'
  const rec: MedRecord = {
    id: m.id, icon: '💊',
    title:     `${m.name} ${species} ${petName}`,
    dose:      m.dosage ?? '',
    frequency: m.frequency ?? '',
    startDate: m.startDate ?? '',
    endDate:   m.endDate   ?? '',
    notes:     m.notes     ?? '',
    bg: 'var(--warn-hl)', color: 'var(--warn)', badge: 'Activo', badgeCls: 'badge-green', archived: false,
  }
  petIdMap.set(rec.id, m.petId)
  return rec
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
  markMedicationAdministered:  (med: MedRecord, date: string) => string
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
        for (const p of pets) {
          PET_NAME[p.id]  = p.name
          PET_EMOJI[p.id] = p.species === 'cat' ? '🐱' : p.species === 'dog' ? '🐶' : '🐾'
        }
        const results = await Promise.all(
          pets.map(p =>
            medicationsApi.getAll(p.id)
              .then(r => r.data.map(m => ({ ...m, petId: p.id, petName: p.name, petSpecies: p.species })))
              .catch(() => [])
          )
        )
        if (cancelled) return
        setMedications(results.flat().map(m => mapApiMed(m as any)))
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Error al cargar medicamentos') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  const active  = useMemo(() => medications.filter(m => !m.archived), [medications])
  const history = useMemo(() => medications.filter(m =>  m.archived), [medications])

  const addMedication = useCallback((data: AddMedData): MedRecord => {
    const petName  = PET_NAME[data.petId]  ?? 'Mascota'
    const petEmoji = PET_EMOJI[data.petId] ?? '🐾'
    const newMed: MedRecord = {
      id: `m-${Date.now()}`, icon: '💊',
      title: `${data.name} ${petEmoji} ${petName}`,
      dose: data.dose, frequency: data.frequency,
      startDate: data.startDate, endDate: data.endDate, notes: data.notes,
      bg: 'var(--warn-hl)', color: 'var(--warn)', badge: 'Activo', badgeCls: 'badge-green', archived: false,
    }
    petIdMap.set(newMed.id, data.petId)
    setMedications(prev => [newMed, ...prev])
    return newMed
  }, [])

  const updateMedication    = useCallback((u: MedRecord)  => setMedications(p => p.map(m => m.id === u.id ? u : m)), [])
  const deleteMedication    = useCallback((id: string)    => setMedications(p => p.filter(m => m.id !== id)), [])
  const archiveMedication   = useCallback((id: string)    => setMedications(p => p.map(m => m.id === id ? { ...m, archived: true,  badge: 'Terminado', badgeCls: 'badge-gray'  } : m)), [])
  const unarchiveMedication = useCallback((id: string)    => setMedications(p => p.map(m => m.id === id ? { ...m, archived: false, badge: 'Activo',    badgeCls: 'badge-green' } : m)), [])

  const markMedicationAdministered = useCallback((_med: MedRecord, date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }), [])

  const getMedicationById           = useCallback((id: string) => medications.find(m => m.id === id), [medications])
  const getMedicationsByPetId       = useCallback((petId: string) => medications.filter(m => inferPetId(m) === petId), [medications])
  const getActiveMedicationsByPetId = useCallback((petId: string) => medications.filter(m => !m.archived && inferPetId(m) === petId), [medications])

  const value = useMemo(() => ({
    medications, active, history, loading, error,
    addMedication, updateMedication, deleteMedication,
    archiveMedication, unarchiveMedication, markMedicationAdministered,
    getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId,
  }), [medications, active, history, loading, error,
      addMedication, updateMedication, deleteMedication,
      archiveMedication, unarchiveMedication, markMedicationAdministered,
      getMedicationById, getMedicationsByPetId, getActiveMedicationsByPetId])

  return <MedicationsContext.Provider value={value}>{children}</MedicationsContext.Provider>
}

export function useMedications() {
  const ctx = useContext(MedicationsContext)
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider')
  return ctx
}
