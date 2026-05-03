import { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react'
import { vetsApi, appointmentsApi } from '../api'
import type { ApiVet, ApiAppointment } from '../api'

export { CONDITIONS_CATALOG } from './conditionsCatalog'
export type { ConditionItem }  from './conditionsCatalog'

export interface Surgery { id: string; name: string; date?: string; notes?: string }

export interface PetMedicalProfile {
  petId: string; sex?: 'male' | 'female'; neutered?: boolean; neuteredAge?: string
  bloodType?: string; allergies?: string; chronicConditionIds: string[]
  customConditions: string[]; surgeries: Surgery[]; behavioralNotes?: string
  environment?: 'apartment' | 'house' | 'both'; livingWithAnimals?: boolean
  parasiteControl?: string; vetQuestions?: string; updatedAt?: string
}

export type VetType = 'primary' | 'specialist' | 'emergency' | 'other'

export interface VetContact {
  id: string; name: string; clinic: string; type: VetType
  specialty?: string; phone: string; phone2?: string
  address?: string; notes?: string; petIds: string[]; createdAt: string
}

export type AppointmentType = 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other'

export interface VetAppointment {
  id: string; petId: string; vetContactId?: string; vetName: string
  clinic?: string; date: string; time?: string; type: AppointmentType
  reason: string; diagnosis?: string; treatment?: string
  nextAppointmentDate?: string; nextAppointmentNote?: string
  weightKg?: number; costBrl?: number; notes?: string; createdAt: string
}

export interface VetCalendarDate { date: string; petId: string; label: string; kind: 'past' | 'next' }

interface VetContextValue {
  getMedicalProfile:  (petId: string) => PetMedicalProfile
  saveMedicalProfile: (profile: PetMedicalProfile) => void
  vets:               VetContact[]
  addVet:             (v: Omit<VetContact, 'id' | 'createdAt'>) => void
  updateVet:          (v: VetContact) => void
  deleteVet:          (id: string) => void
  appointments:       VetAppointment[]
  addAppointment:     (a: Omit<VetAppointment, 'id' | 'createdAt'>) => void
  updateAppointment:  (a: VetAppointment) => void
  deleteAppointment:  (id: string) => void
  vetCalendarDates:   VetCalendarDate[]
  loading:            boolean
  error:              string | null
  refetch:            () => void
}

const VetContext = createContext<VetContextValue | null>(null)

function buildDefaultProfile(petId: string): PetMedicalProfile {
  return { petId, chronicConditionIds: [], customConditions: [], surgeries: [] }
}

export function VetProvider({ children }: { children: ReactNode }) {
  const [profiles,     setProfiles]     = useState<Record<string, PetMedicalProfile>>({})
  const [vets,         setVets]         = useState<VetContact[]>([])
  const [appointments, setAppointments] = useState<VetAppointment[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [tick,         setTick]         = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    vetsApi.getAll()
      .then(async res => {
        if (cancelled) return
        setVets(res.data as unknown as VetContact[])
        const results = await Promise.all(
          (res.data as ApiVet[]).map(v =>
            appointmentsApi.getAll(v.id)
              .then(r => r.data as unknown as VetAppointment[])
              .catch(() => [] as VetAppointment[])
          )
        )
        if (!cancelled) setAppointments(results.flat())
      })
      .catch(err => { if (!cancelled) setError(err?.message ?? 'Error al cargar veterinarios') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [tick])

  const getMedicalProfile  = useCallback((petId: string) => profiles[petId] ?? buildDefaultProfile(petId), [profiles])
  const saveMedicalProfile = useCallback((profile: PetMedicalProfile) =>
    setProfiles(prev => ({ ...prev, [profile.petId]: { ...profile, updatedAt: new Date().toISOString() } })), [])

  const addVet    = useCallback((data: Omit<VetContact, 'id' | 'createdAt'>) =>
    setVets(prev => [...prev, { ...data, id: `vet-${Date.now()}`, createdAt: new Date().toISOString() }]), [])
  const updateVet = useCallback((vet: VetContact) =>
    setVets(prev => prev.map(v => v.id === vet.id ? vet : v)), [])
  const deleteVet = useCallback((id: string) =>
    setVets(prev => prev.filter(v => v.id !== id)), [])

  const addAppointment    = useCallback((data: Omit<VetAppointment, 'id' | 'createdAt'>) =>
    setAppointments(prev => [...prev, { ...data, id: `apt-${Date.now()}`, createdAt: new Date().toISOString() }]), [])
  const updateAppointment = useCallback((appt: VetAppointment) =>
    setAppointments(prev => prev.map(a => a.id === appt.id ? appt : a)), [])
  const deleteAppointment = useCallback((id: string) =>
    setAppointments(prev => prev.filter(a => a.id !== id)), [])

  const vetCalendarDates = useMemo<VetCalendarDate[]>(() => {
    const result: VetCalendarDate[] = []
    for (const appt of appointments) {
      result.push({ date: appt.date, petId: appt.petId, label: appt.reason, kind: 'past' })
      if (appt.nextAppointmentDate)
        result.push({ date: appt.nextAppointmentDate, petId: appt.petId, label: appt.nextAppointmentNote ?? 'Retorno programado', kind: 'next' })
    }
    return result
  }, [appointments])

  return (
    <VetContext.Provider value={{
      getMedicalProfile, saveMedicalProfile,
      vets, addVet, updateVet, deleteVet,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      vetCalendarDates, loading, error, refetch,
    }}>
      {children}
    </VetContext.Provider>
  )
}

export function useVet() {
  const ctx = useContext(VetContext)
  if (!ctx) throw new Error('useVet must be used inside VetProvider')
  return ctx
}
