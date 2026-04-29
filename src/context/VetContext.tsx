import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const CONDITION_GROUPS = {
  endocrine: 'Endócrinas y Metabólicas',
  degenerative: 'Degenerativas y Estructurales',
  viral: 'Virales Incurables',
  neurological: 'Neurológicas y Autoinmunes',
  other: 'Otras Condiciones',
} as const

export interface ConditionItem {
  id: string
  label: string
  group: string
  species?: 'cat' | 'dog'
}

export const CONDITIONS_CATALOG: ConditionItem[] = [
  { id: 'diabetes', label: 'Diabetes Mellitus', group: CONDITION_GROUPS.endocrine },
  { id: 'hypothyroidism', label: 'Hipotiroidismo', group: CONDITION_GROUPS.endocrine, species: 'dog' },
  { id: 'hyperthyroidism', label: 'Hipertiroidismo', group: CONDITION_GROUPS.endocrine, species: 'cat' },
  { id: 'ckd', label: 'Insuficiencia Renal Crónica', group: CONDITION_GROUPS.degenerative },
  { id: 'arthritis', label: 'Artritis y Artrosis', group: CONDITION_GROUPS.degenerative },
  { id: 'hipdysplasia', label: 'Displasia de Cadera', group: CONDITION_GROUPS.degenerative },
  { id: 'cardiopathy', label: 'Cardiopatías Crónicas', group: CONDITION_GROUPS.degenerative },
  { id: 'felv', label: 'FeLV Leucemia Felina', group: CONDITION_GROUPS.viral, species: 'cat' },
  { id: 'fiv', label: 'FIV Inmunodeficiencia Felina', group: CONDITION_GROUPS.viral, species: 'cat' },
  { id: 'epilepsy', label: 'Epilepsia', group: CONDITION_GROUPS.neurological },
  { id: 'lupus', label: 'Lupus y Pénfigo', group: CONDITION_GROUPS.neurological },
  { id: 'atopy', label: 'Atopia y Alergias Crónicas', group: CONDITION_GROUPS.other },
  { id: 'blinddeaf', label: 'Ceguera o Sordera', group: CONDITION_GROUPS.other },
]

export interface Surgery {
  id: string
  name: string
  date?: string
  notes?: string
}

export interface PetMedicalProfile {
  petId: string
  sex?: 'male' | 'female'
  neutered?: boolean
  neuteredAge?: string
  bloodType?: string
  allergies?: string
  chronicConditionIds: string[]
  customConditions: string[]
  surgeries: Surgery[]
  behavioralNotes?: string
  environment?: 'apartment' | 'house' | 'both'
  livingWithAnimals?: boolean
  parasiteControl?: string
  vetQuestions?: string
  updatedAt?: string
}

export type VetType = 'primary' | 'specialist' | 'emergency' | 'other'

export interface VetContact {
  id: string
  name: string
  clinic: string
  type: VetType
  specialty?: string
  phone: string
  phone2?: string
  address?: string
  notes?: string
  petIds: string[]
  createdAt: string
}

export type AppointmentType =
  | 'routine'
  | 'emergency'
  | 'specialist'
  | 'followup'
  | 'exam'
  | 'vaccine'
  | 'other'

export interface VetAppointment {
  id: string
  petId: string
  vetContactId?: string
  vetName: string
  clinic?: string
  date: string
  time?: string
  type: AppointmentType
  reason: string
  diagnosis?: string
  treatment?: string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?: number
  costBrl?: number
  notes?: string
  createdAt: string
}

export interface VetCalendarDate {
  date: string
  petId: string
  label: string
  kind: 'past' | 'next'
}

interface VetContextValue {
  getMedicalProfile: (petId: string) => PetMedicalProfile
  saveMedicalProfile: (profile: PetMedicalProfile) => void
  vets: VetContact[]
  addVet: (v: Omit<VetContact, 'id' | 'createdAt'>) => void
  updateVet: (v: VetContact) => void
  deleteVet: (id: string) => void
  appointments: VetAppointment[]
  addAppointment: (a: Omit<VetAppointment, 'id' | 'createdAt'>) => void
  updateAppointment: (a: VetAppointment) => void
  deleteAppointment: (id: string) => void
  vetCalendarDates: VetCalendarDate[]
}

const VetContext = createContext<VetContextValue | null>(null)

function buildDefaultProfile(petId: string): PetMedicalProfile {
  return {
    petId,
    chronicConditionIds: [],
    customConditions: [],
    surgeries: [],
  }
}

export function VetProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, PetMedicalProfile>>({})
  const [vets, setVets] = useState<VetContact[]>([])
  const [appointments, setAppointments] = useState<VetAppointment[]>([])

  const getMedicalProfile = (petId: string) => profiles[petId] ?? buildDefaultProfile(petId)

  const saveMedicalProfile = (profile: PetMedicalProfile) => {
    setProfiles(prev => ({
      ...prev,
      [profile.petId]: {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  const addVet = (data: Omit<VetContact, 'id' | 'createdAt'>) => {
    setVets(prev => [
      ...prev,
      { ...data, id: `vet-${Date.now()}`, createdAt: new Date().toISOString() },
    ])
  }

  const updateVet = (vet: VetContact) => {
    setVets(prev => prev.map(v => (v.id === vet.id ? vet : v)))
  }

  const deleteVet = (id: string) => {
    setVets(prev => prev.filter(v => v.id !== id))
  }

  const addAppointment = (data: Omit<VetAppointment, 'id' | 'createdAt'>) => {
    setAppointments(prev => [
      ...prev,
      { ...data, id: `apt-${Date.now()}`, createdAt: new Date().toISOString() },
    ])
  }

  const updateAppointment = (appointment: VetAppointment) => {
    setAppointments(prev => prev.map(a => (a.id === appointment.id ? appointment : a)))
  }

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  const vetCalendarDates = useMemo<VetCalendarDate[]>(() => {
    const result: VetCalendarDate[] = []

    for (const appt of appointments) {
      result.push({
        date: appt.date,
        petId: appt.petId,
        label: appt.reason,
        kind: 'past',
      })

      if (appt.nextAppointmentDate) {
        result.push({
          date: appt.nextAppointmentDate,
          petId: appt.petId,
          label: appt.nextAppointmentNote ?? 'Retorno programado',
          kind: 'next',
        })
      }
    }

    return result
  }, [appointments])

  return (
    <VetContext.Provider
      value={{
        getMedicalProfile,
        saveMedicalProfile,
        vets,
        addVet,
        updateVet,
        deleteVet,
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        vetCalendarDates,
      }}
    >
      {children}
    </VetContext.Provider>
  )
}

export function useVet() {
  const ctx = useContext(VetContext)
  if (!ctx) throw new Error('useVet must be used inside VetProvider')
  return ctx
}