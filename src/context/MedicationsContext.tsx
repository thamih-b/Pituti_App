import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AddMedData } from '../components/AddMedicationModal'
import type { MedRecord } from '../components/EditMedModal'

const PET_EMOJI: Record<string, string> = {
  'pet-1': '🐱',
  'pet-2': '🐶',
  'pet-3': '🦜',
}

const PET_NAME: Record<string, string> = {
  'pet-1': 'Luna',
  'pet-2': 'Toby',
  'pet-3': 'Kiwi',
}

const INITIAL_MEDICATIONS: MedRecord[] = [
  {
    id: 'm1',
    icon: '💊',
    title: 'Bravecto 🐱 Luna',
    dose: '1 comprimido',
    frequency: 'Cada 3 meses',
    startDate: '2026-01-10',
    endDate: '',
    notes: 'Antiparasitario oral.',
    bg: 'var(--warn-hl)',
    color: 'var(--warn)',
    badge: 'Activo',
    badgeCls: 'badge-green',
    archived: false,
  },
  {
    id: 'm2',
    icon: '🧴',
    title: 'Pipeta antipulgas 🐶 Toby',
    dose: '1 pipeta',
    frequency: 'Mensual',
    startDate: '2026-03-30',
    endDate: '',
    notes: 'Aplicar en la nuca.',
    bg: 'var(--blue-hl)',
    color: 'var(--blue)',
    badge: 'Esta semana',
    badgeCls: 'badge-yellow',
    archived: false,
  },
  {
    id: 'h1',
    icon: '💉',
    title: 'Amoxicilina 🐱 Luna',
    dose: '1 comprimido / 12h',
    frequency: 'Cada 12 horas',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    notes: 'Infección leve. 7 días.',
    bg: 'var(--surface-offset)',
    color: 'var(--text-faint)',
    badge: 'Terminado',
    badgeCls: 'badge-gray',
    archived: true,
  },
  {
    id: 'h2',
    icon: '💉',
    title: 'Cortisona inyectable 🐶 Toby',
    dose: '2 ml',
    frequency: 'Única dosis',
    startDate: '2026-01-15',
    endDate: '2026-01-15',
    notes: '3 aplicaciones en total.',
    bg: 'var(--surface-offset)',
    color: 'var(--text-faint)',
    badge: 'Terminado',
    badgeCls: 'badge-gray',
    archived: true,
  },
  {
    id: 'pet-luna-1',
    icon: '💊',
    bg: 'var(--warn-hl)',
    color: 'var(--warn)',
    title: 'Antiparasitario Bravecto',
    dose: '1 comprimido',
    frequency: 'cada 3 meses',
    startDate: '',
    endDate: '2026-07-10',
    notes: '',
    badge: 'Activo',
    badgeCls: 'badge-green',
    archived: false,
  },
]

type MedicationsContextValue = {
  medications: MedRecord[]
  active: MedRecord[]
  history: MedRecord[]
  addMedication: (data: AddMedData) => MedRecord
  updateMedication: (updated: MedRecord) => void
  deleteMedication: (id: string) => void
  archiveMedication: (id: string) => void
  unarchiveMedication: (id: string) => void
  markMedicationAdministered: (med: MedRecord, date: string) => string
  getMedicationById: (id: string) => MedRecord | undefined
  getMedicationsByPetId: (petId: string) => MedRecord[]
  getActiveMedicationsByPetId: (petId: string) => MedRecord[]
}

const MedicationsContext = createContext<MedicationsContextValue | null>(null)

function inferPetIdFromMedication(med: MedRecord): string | undefined {
  if (med.title.includes('Luna')) return 'pet-1'
  if (med.title.includes('Toby')) return 'pet-2'
  if (med.title.includes('Kiwi')) return 'pet-3'
  return undefined
}

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<MedRecord[]>(INITIAL_MEDICATIONS)

  const active = useMemo(
    () => medications.filter((m) => !m.archived),
    [medications]
  )

  const history = useMemo(
    () => medications.filter((m) => m.archived),
    [medications]
  )

  const addMedication = useCallback((data: AddMedData) => {
    const petName = PET_NAME[data.petId] ?? 'Mascota'
    const petEmoji = PET_EMOJI[data.petId] ?? '🐾'

    const newMed: MedRecord = {
      id: `m-${Date.now()}`,
      icon: '💊',
      title: `${data.name} ${petEmoji} ${petName}`,
      dose: data.dose,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes,
      bg: 'var(--warn-hl)',
      color: 'var(--warn)',
      badge: 'Activo',
      badgeCls: 'badge-green',
      archived: false,
    }

    setMedications((prev) => [newMed, ...prev])
    return newMed
  }, [])

  const updateMedication = useCallback((updated: MedRecord) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    )
  }, [])

  const deleteMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const archiveMedication = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              archived: true,
              badge: 'Terminado',
              badgeCls: 'badge-gray',
            }
          : m
      )
    )
  }, [])

  const unarchiveMedication = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              archived: false,
              badge: 'Activo',
              badgeCls: 'badge-green',
            }
          : m
      )
    )
  }, [])

  const markMedicationAdministered = useCallback((med: MedRecord, date: string) => {
    return new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }, [])

  const getMedicationById = useCallback(
    (id: string) => medications.find((m) => m.id === id),
    [medications]
  )

  const getMedicationsByPetId = useCallback(
    (petId: string) =>
      medications.filter((m) => inferPetIdFromMedication(m) === petId),
    [medications]
  )

  const getActiveMedicationsByPetId = useCallback(
    (petId: string) =>
      medications.filter(
        (m) => !m.archived && inferPetIdFromMedication(m) === petId
      ),
    [medications]
  )

  const value = useMemo(
    () => ({
      medications,
      active,
      history,
      addMedication,
      updateMedication,
      deleteMedication,
      archiveMedication,
      unarchiveMedication,
      markMedicationAdministered,
      getMedicationById,
      getMedicationsByPetId,
      getActiveMedicationsByPetId,
    }),
    [
      medications,
      active,
      history,
      addMedication,
      updateMedication,
      deleteMedication,
      archiveMedication,
      unarchiveMedication,
      markMedicationAdministered,
      getMedicationById,
      getMedicationsByPetId,
      getActiveMedicationsByPetId,
    ]
  )

  return (
    <MedicationsContext.Provider value={value}>
      {children}
    </MedicationsContext.Provider>
  )
}

export function useMedications() {
  const ctx = useContext(MedicationsContext)
  if (!ctx) {
    throw new Error('useMedications must be used within MedicationsProvider')
  }
  return ctx
}