import {
  createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import { vetsApi, appointmentsApi } from '../api'
import type { ApiVet, ApiAppointment } from '../api'
import type { DigitalPrescription } from './VetPrescriptionsContext';
import type { DigitalPrescriptionStatus } from './TabPrescriptions';

export { CONDITIONS_CATALOG } from './conditionsCatalog'
export type { ConditionItem } from './conditionsCatalog'

// ─── Medical Profile ─────────────────────────────────────────────────────────

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

// ─── Vets & Appointments ──────────────────────────────────────────────────────

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
  | 'routine' | 'emergency' | 'specialist' | 'followup'
  | 'exam' | 'vaccine' | 'other'

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

// ─── Exams ────────────────────────────────────────────────────────────────────

export type { ExamRecord, ExamType }          from './VetExamsContext';

// ─── Prescriptions ────────────────────────────────────────────────────────────

export type DocType = 'passport' | 'certificate' | 'report' | 'other';

export type { VetDocument }                   from './VetDocumentsContext';
export type { DigitalPrescription,
              DigitalPrescriptionStatus }      from './VetPrescriptionsContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toUtcMs = (value: string) => new Date(`${value}T00:00:00Z`).getTime()

export function computePrescriptionStatus(
  item: Pick<DigitalPrescription, 'expiresAt' | 'status'>,
  todayStr = new Date().toISOString().split('T')[0],
): DigitalPrescriptionStatus {
  if (item.status === 'used') return 'used'
  if (!item.expiresAt) return 'active'
  const diff = Math.ceil((toUtcMs(item.expiresAt) - toUtcMs(todayStr)) / 86400000)
  if (diff < 0) return 'expired'
  if (diff <= 7) return 'expiring'
  return 'active'
}

// ─── Context value interface ──────────────────────────────────────────────────

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

  prescriptions: DigitalPrescription[]
  addPrescription: (petId: string, data: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>) => void
  updatePrescription: (id: string, data: Partial<Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>>) => void
  deletePrescription: (id: string) => void
  togglePrescriptionUsed: (id: string, used: boolean) => void
  getPrescriptionsByPetId: (petId: string) => DigitalPrescription[]

  vetCalendarDates: VetCalendarDate[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const VetContext = createContext<VetContextValue | null>(null)

function buildDefaultProfile(petId: string): PetMedicalProfile {
  return { petId, chronicConditionIds: [], customConditions: [], surgeries: [] }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function VetProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()

  const [profiles,      setProfiles]      = useState<Record<string, PetMedicalProfile>>({})
  const [vets,          setVets]          = useState<VetContact[]>([])
  const [appointments,  setAppointments]  = useState<VetAppointment[]>([])
  const [prescriptions, setPrescriptions] = useState<DigitalPrescription[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [tick,          setTick]          = useState(0)

  const refetch = useCallback(() => setTick(t => t + 1), [])

  // ── Carga remota de vets + appointments ─────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    vetsApi.getAll()
      .then(async res => {
        if (cancelled) return
        setVets(res.data as unknown as VetContact[])
        // Carga appointments de cada vet en paralelo
        const results = await Promise.all(
          (res.data as ApiVet[]).map(v =>
            appointmentsApi.getAll(v.id)
              .then(r => r.data as unknown as VetAppointment[])
              .catch(() => [] as VetAppointment[])
          )
        )
        if (!cancelled) setAppointments(results.flat())
      })
      .catch(err => {
        if (!cancelled) setError(err?.message ?? t('vet.errorLoadingVets'))
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [tick, t])

  // ── Medical Profile ─────────────────────────────────────────
  const getMedicalProfile = useCallback(
    (petId: string) => profiles[petId] ?? buildDefaultProfile(petId),
    [profiles],
  )
  const saveMedicalProfile = useCallback(
    (profile: PetMedicalProfile) =>
      setProfiles(prev => ({
        ...prev,
        [profile.petId]: { ...profile, updatedAt: new Date().toISOString() },
      })),
    [],
  )

  // ── Vets (optimistic + sync API) ────────────────────────────
  const addVet = useCallback(
    (data: Omit<VetContact, 'id' | 'createdAt'>) => {
      // Actualización optimista con id temporal
      const tempId = `vet-tmp-${Date.now()}`
      const temp: VetContact = { ...data, id: tempId, createdAt: new Date().toISOString() }
      setVets(prev => [...prev, temp])

      vetsApi.create(data)
        .then(res => {
          // Reemplaza el temp con el registro real del servidor
          const created = res.data as unknown as VetContact
          setVets(prev => prev.map(v => v.id === tempId ? created : v))
        })
        .catch(() => {
          // Revierte si la API falla
          setVets(prev => prev.filter(v => v.id !== tempId))
        })
    },
    [],
  )

  const updateVet = useCallback(
    (vet: VetContact) => {
      setVets(prev => prev.map(v => v.id === vet.id ? vet : v))
      vetsApi.update(vet.id, vet).catch(() => setTick(t => t + 1))
    },
    [],
  )

  const deleteVet = useCallback(
    (id: string) => {
      setVets(prev => prev.filter(v => v.id !== id))
      vetsApi.delete(id).catch(() => setTick(t => t + 1))
    },
    [],
  )

  // ── Appointments (optimistic + sync API) ────────────────────
  const addAppointment = useCallback(
    (data: Omit<VetAppointment, 'id' | 'createdAt'>) => {
      const tempId = `appt-tmp-${Date.now()}`
      const temp: VetAppointment = { ...data, id: tempId, createdAt: new Date().toISOString() }
      setAppointments(prev => [...prev, temp])

      // La API sólo puede crear si hay un vetContactId
      if (data.vetContactId) {
        appointmentsApi.create(data.vetContactId, data)
          .then(res => {
            const created = res.data as unknown as VetAppointment
            setAppointments(prev => prev.map(a => a.id === tempId ? created : a))
          })
          .catch(() => {
            setAppointments(prev => prev.filter(a => a.id !== tempId))
          })
      }
    },
    [],
  )

  const updateAppointment = useCallback(
    (appt: VetAppointment) => {
      setAppointments(prev => prev.map(a => a.id === appt.id ? appt : a))
      if (appt.vetContactId) {
        appointmentsApi.update(appt.vetContactId, appt.id, appt)
          .catch(() => setTick(t => t + 1))
      }
    },
    [],
  )

  const deleteAppointment = useCallback(
    (id: string) => {
      // Usa el setter funcional para acceder al estado actual sin dependencia
      setAppointments(prev => {
        const appt = prev.find(a => a.id === id)
        if (appt?.vetContactId) {
          appointmentsApi.delete(appt.vetContactId, id).catch(() => {})
        }
        return prev.filter(a => a.id !== id)
      })
    },
    [],
  )

  // ── Prescriptions ───────────────────────────────────────────
  const getPrescriptionsByPetId = useCallback(
    (petId: string) => prescriptions.filter(item => item.petId === petId),
    [prescriptions],
  )

  const addPrescription = useCallback(
    (petId: string, data: Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>) => {
      const todayStr = new Date().toISOString().split('T')[0]
      const item: DigitalPrescription = {
        ...data,
        petId,
        id: `rx-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: computePrescriptionStatus(
          { expiresAt: data.expiresAt, status: data.status },
          todayStr,
        ),
      }
      setPrescriptions(prev => [item, ...prev])
    },
    [],
  )

  const updatePrescription = useCallback(
    (id: string, data: Partial<Omit<DigitalPrescription, 'id' | 'petId' | 'createdAt'>>) => {
      const todayStr = new Date().toISOString().split('T')[0]
      setPrescriptions(prev =>
        prev.map(item => {
          if (item.id !== id) return item
          const next = { ...item, ...data }
          return {
            ...next,
            status: computePrescriptionStatus(
              { expiresAt: next.expiresAt, status: next.status },
              todayStr,
            ),
          }
        })
      )
    },
    [],
  )

  const deletePrescription = useCallback(
    (id: string) => setPrescriptions(prev => prev.filter(item => item.id !== id)),
    [],
  )

  const togglePrescriptionUsed = useCallback(
    (id: string, used: boolean) => {
      const todayStr = new Date().toISOString().split('T')[0]
      setPrescriptions(prev =>
        prev.map(item => {
          if (item.id !== id) return item
          const nextStatus: DigitalPrescriptionStatus = used
            ? 'used'
            : computePrescriptionStatus(
                { expiresAt: item.expiresAt, status: 'active' },
                todayStr,
              )
          return { ...item, status: nextStatus }
        })
      )
    },
    [],
  )

  // ── Calendar dates ──────────────────────────────────────────
  const vetCalendarDates = useMemo<VetCalendarDate[]>(() => {
    const result: VetCalendarDate[] = []
    for (const appt of appointments) {
      result.push({ date: appt.date, petId: appt.petId, label: appt.reason, kind: 'past' })
      if (appt.nextAppointmentDate)
        result.push({
          date:  appt.nextAppointmentDate,
          petId: appt.petId,
          label: appt.nextAppointmentNote ?? t('vet.scheduledReturn'),
          kind:  'next',
        })
    }
    return result
  }, [appointments, t])

  // ── Context value ───────────────────────────────────────────
  const value = useMemo<VetContextValue>(
    () => ({
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
      prescriptions,
      addPrescription,
      updatePrescription,
      deletePrescription,
      togglePrescriptionUsed,
      getPrescriptionsByPetId,
      vetCalendarDates,
      loading,
      error,
      refetch,
    }),
    [
      getMedicalProfile, saveMedicalProfile,
      vets, addVet, updateVet, deleteVet,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      prescriptions, addPrescription, updatePrescription,
      deletePrescription, togglePrescriptionUsed, getPrescriptionsByPetId,
      vetCalendarDates, loading, error, refetch,
    ],
  )

  return <VetContext.Provider value={value}>{children}</VetContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVet() {
  const ctx = useContext(VetContext)
  if (!ctx) throw new Error('useVet must be used inside VetProvider')
  return ctx
}
