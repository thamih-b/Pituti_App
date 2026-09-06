// src/context/VetContext.tsx
// Cloud-sync para vets (já existia), appointments e medical profiles (novos).
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { vetsApi, appointmentsApi, medicalProfilesApi, petsApi } from '../api'
import type { CreateVetDto, UpdateVetDto, ApiAppointment } from '../api'
import { useUser } from './UserContext'
import type { AppointmentType } from '../api/types'


// ── Tipos exportados ───────────────────────────────────────────────────────────

export interface Vet {
  id: string
  ownerId: string
  name: string
  clinic?: string | null
  phone?: string | null
  type?: 'primary' | 'specialist' | 'emergency' | 'other'
  specialty?: string | null
  phone2?: string | null
  address?: string | null
  notes?: string | null
  petIds: string[]
  createdAt?: string
}

export interface VetAppointment {
  id: string
  petId: string
  type: string
  date: string
  createdAt: string
  vetContactId?: string
  vetName: string
  clinic?: string
  reason: string
  diagnosis?: string
  treatment?: string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?: number
  notes?: string
}

export interface Surgery {
  id: string
  name: string
  date?: string
  notes?: string
}

export interface PetMedicalProfile {
  petId?: string
  sex?: 'male' | 'female'
  neutered?: boolean
  neuteredAge?: string
  bloodType?: string
  allergies?: string
  chronicConditionIds: (
    | 'diabetes' | 'hypothyroidism' | 'hyperthyroidism' | 'ckd'
    | 'arthritis' | 'hipdysplasia' | 'cardiopathy' | 'felv' | 'fiv'
    | 'epilepsy' | 'lupus' | 'atopy' | 'blinddeaf'
  )[]
  customConditions: string[]
  surgeries: Surgery[]
  environment?: 'apartment' | 'house' | 'both'
  livingWithAnimals?: boolean
  parasiteControl?: string
  behavioralNotes?: string
  vetQuestions?: string
  updatedAt?: string
}

type VetCalendarEvent = {
  date: string
  kind: 'past' | 'next'
  petId: string
  label: string
}

// ── Helpers de storage ────────────────────────────────────────────────────────

const EMPTY_PROFILE: Omit<PetMedicalProfile, 'petId'> = {
  chronicConditionIds: [],
  customConditions: [],
  surgeries: [],
}

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

function saveLS<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

// ── Mapper API → VetAppointment ───────────────────────────────────────────────

function apiToAppt(api: ApiAppointment): VetAppointment {
  return {
    id:                  api.id,
    petId:               api.petId,
    type:                api.type,
    date:                api.date,
    createdAt:           api.createdAt,
    vetContactId:        api.vetId  ?? undefined,
    vetName:             api.vetName,
    clinic:              api.clinic        ?? undefined,
    reason:              api.reason,
    diagnosis:           api.diagnosis     ?? undefined,
    treatment:           api.treatment     ?? undefined,
    nextAppointmentDate: api.nextAppointmentDate ?? undefined,
    nextAppointmentNote: api.nextAppointmentNote ?? undefined,
    weightKg:            api.weightKg      ?? undefined,
    notes:               api.notes         ?? undefined,
  }
}

// ── Context interface ─────────────────────────────────────────────────────────

interface VetContextValue {
  vets: Vet[]
  loading: boolean
  error: string | null
  fetchVets: () => Promise<void>
  addVet: (data: Omit<Vet, 'id'>) => Promise<Vet>
  updateVet: (vet: Vet) => Promise<void>
  deleteVet: (id: string) => Promise<void>
  appointments: VetAppointment[]
  addAppointment: (a: Omit<VetAppointment, 'id'>) => void
  updateAppointment: (a: VetAppointment) => void
  deleteAppointment: (id: string) => void
  getMedicalProfile: (petId: string) => PetMedicalProfile
  saveMedicalProfile: (profile: PetMedicalProfile) => void
  vetCalendarDates: VetCalendarEvent[]
}

const VetContext = createContext<VetContextValue | null>(null)

export function VetProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, ready } = useUser()

  const [vets,         setVets]         = useState<Vet[]>([])
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [appointments, setAppointments] = useState<VetAppointment[]>([])
  const [profiles,     setProfiles]     = useState<Record<string, PetMedicalProfile>>({})

  // Chaves localStorage
  const apptKey     = user.id ? `pituti_appointments_${user.id}` : null
  const profilesKey = user.id ? `pituti_profiles_${user.id}` : null

  // ── Carrega localStorage ao iniciar ─────────────────────────────────────────
  useEffect(() => {
    if (!ready || !user.id) {
      setAppointments([]); setProfiles({}); return
    }
    setAppointments(loadLS<VetAppointment[]>(`pituti_appointments_${user.id}`, []))
    setProfiles(loadLS<Record<string, PetMedicalProfile>>(`pituti_profiles_${user.id}`, {}))
  }, [ready, user.id])

  // ── Persiste appointments e profiles no localStorage ────────────────────────
  useEffect(() => {
    if (apptKey) saveLS(apptKey, appointments)
  }, [appointments, apptKey])

  useEffect(() => {
    if (profilesKey) saveLS(profilesKey, profiles)
  }, [profiles, profilesKey])

  // ── VETS: fetch da API ───────────────────────────────────────────────────────

  const fetchVets = useCallback(async () => {
    if (!ready || !isAuthenticated) return
    setLoading(true); setError(null)
    try {
      const res = await vetsApi.getAll()
      const raw = (res.data as unknown as any[]).map(v => ({
        ...v,
        petIds: Array.isArray(v.petIds) ? v.petIds : [],
      }))
      setVets(raw)
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar veterinários')
    } finally {
      setLoading(false)
    }
  }, [ready, isAuthenticated])

  useEffect(() => {
    if (ready && isAuthenticated) fetchVets()
    else if (ready && !isAuthenticated) setVets([])
  }, [ready, isAuthenticated, fetchVets])

  const addVet = async (data: Omit<Vet, 'id'>): Promise<Vet> => {
    const res = await vetsApi.create(data as unknown as CreateVetDto)
    const v = { ...(res.data as unknown as Vet), petIds: Array.isArray((res.data as any).petIds) ? (res.data as any).petIds : [] }
    setVets(prev => [v, ...prev])
    return v
  }

  const updateVet = async (vet: Vet): Promise<void> => {
    const res = await vetsApi.update(vet.id, vet as unknown as UpdateVetDto)
    const u = { ...(res.data as unknown as Vet), petIds: Array.isArray((res.data as any).petIds) ? (res.data as any).petIds : [] }
    setVets(prev => prev.map(v => v.id === vet.id ? u : v))
  }

  const deleteVet = async (id: string): Promise<void> => {
    await vetsApi.delete(id)
    setVets(prev => prev.filter(v => v.id !== id))
  }

  // ── APPOINTMENTS: cloud sync ─────────────────────────────────────────────────
  //
  // Ao carregar: para cada vet, busca appointments da API → mescla com localStorage.
  // Garante que appointments não se perdem ao mudar de dispositivo.

  useEffect(() => {
    if (!ready || !isAuthenticated || !user.id || !vets.length) return

    let cancelled = false

    Promise.all(
      vets.map(v =>
        appointmentsApi
          .getAll(v.id)
          .then(r => r.data.map(apiToAppt))
          .catch(() => [] as VetAppointment[]),
      ),
    ).then(results => {
      if (cancelled) return
      const apiAppts = results.flat()
      if (!apiAppts.length) return

      setAppointments(prev => {
        // Mantém appointments locais (id começa com 'appt-') que ainda não sincronizaram
        const localOnly = prev.filter(
          a => a.id.startsWith('appt-') && !apiAppts.find(x => x.id === a.id),
        )
        const merged = [...apiAppts, ...localOnly]
        if (user.id) saveLS(`pituti_appointments_${user.id}`, merged)
        return merged
      })
    })

    return () => { cancelled = true }
  }, [ready, isAuthenticated, user.id, vets])

  const addAppointment = useCallback(
    (a: Omit<VetAppointment, 'id'>) => {
      const tempId = `appt-${Date.now()}`
      const local: VetAppointment = { ...a, id: tempId }
      setAppointments(prev => [local, ...prev])

      // Persiste na API se tivermos vetContactId
      if (a.vetContactId) {
        appointmentsApi
          .create(a.vetContactId, {
            petId:               a.petId,
            vetContactId:        a.vetContactId,
            vetName:             a.vetName,
            clinic:              a.clinic,
            type:                a.type as AppointmentType,
            date:                a.date,
            reason:              a.reason,
            diagnosis:           a.diagnosis,
            treatment:           a.treatment,
            nextAppointmentDate: a.nextAppointmentDate,
            nextAppointmentNote: a.nextAppointmentNote,
            weightKg:            a.weightKg,
            notes:               a.notes,
          })
          .then(res => {
            const serverAppt = apiToAppt(res.data)
            setAppointments(prev =>
              prev.map(x => x.id === tempId ? serverAppt : x),
            )
          })
          .catch(() => { /* mantém ID local */ })
      }
    },
    [],
  )

  const updateAppointment = useCallback(
    (a: VetAppointment) => {
      setAppointments(prev => prev.map(x => x.id === a.id ? a : x))

      if (a.vetContactId && !a.id.startsWith('appt-')) {
        appointmentsApi
          .update(a.vetContactId, a.id, {
            petId:               a.petId,
            vetContactId:        a.vetContactId,
            vetName:             a.vetName,
            clinic:              a.clinic,
            type:                a.type  as AppointmentType,
            date:                a.date,
            reason:              a.reason,
            diagnosis:           a.diagnosis,
            treatment:           a.treatment,
            nextAppointmentDate: a.nextAppointmentDate,
            nextAppointmentNote: a.nextAppointmentNote,
            weightKg:            a.weightKg,
            notes:               a.notes,
          })
          .catch(() => { /* silencia */ })
      }
    },
    [],
  )

  const deleteAppointment = useCallback(
    (id: string) => {
      const appt = appointments.find(a => a.id === id)
      setAppointments(prev => prev.filter(a => a.id !== id))

      if (appt?.vetContactId && !id.startsWith('appt-')) {
        appointmentsApi.delete(appt.vetContactId, id).catch(() => { /* silencia */ })
      }
    },
    [appointments],
  )

  // ── MEDICAL PROFILES: cloud sync ─────────────────────────────────────────────
  const KNOWN_CONDITION_IDS = new Set<string>([
  'diabetes', 'hypothyroidism', 'hyperthyroidism', 'ckd', 'arthritis',
  'hipdysplasia', 'cardiopathy', 'felv', 'fiv', 'epilepsy', 'lupus',
  'atopy', 'blinddeaf',
])

// API (ApiMedicalProfile) → modelo local (PetMedicalProfile)
function fromApiProfile(api: any, petId: string): PetMedicalProfile {
  const apiConditions: Array<{ name: string; notes?: string }> = api?.conditions ?? []
  const chronicConditionIds = apiConditions
    .map(c => c.name)
    .filter((name): name is PetMedicalProfile['chronicConditionIds'][number] =>
      KNOWN_CONDITION_IDS.has(name))
  const customConditions = apiConditions
    .map(c => c.name)
    .filter(name => !KNOWN_CONDITION_IDS.has(name))

  return {
    petId,
    sex: api?.sex,
    neutered: api?.neutered ?? undefined,
    neuteredAge: api?.neuteredAge ?? undefined,
    bloodType: api?.bloodType ?? undefined,
    // FIX: a API guarda allergies como string[]; o modelo local usa uma
    // única string (lista separada por vírgulas)
    allergies: Array.isArray(api?.allergies) ? api.allergies.join(', ') : (api?.allergies ?? undefined),
    chronicConditionIds,
    customConditions,
    surgeries: (api?.surgeries ?? []).map((s: any, i: number) => ({
      id: `s-${i}`, name: s.name, notes: s.notes,
    })),
    environment: api?.environment ?? undefined,
    livingWithAnimals: api?.livingWithAnimals ?? undefined,
    behavioralNotes: api?.behavioralNotes ?? undefined,
    vetQuestions: api?.vetQuestions ?? undefined,
    updatedAt: api?.updatedAt ?? undefined,
  }
}

// modelo local (PetMedicalProfile) → API (UpsertMedicalProfileDto)
function toApiProfileDto(profile: PetMedicalProfile) {
  const conditions = [
    ...(profile.chronicConditionIds ?? []).map(id => ({ name: id })),
    ...(profile.customConditions ?? []).map(name => ({ name })),
  ]
  return {
    sex: profile.sex,
    neutered: profile.neutered,
    neuteredAge: profile.neuteredAge,
    bloodType: profile.bloodType,
    allergies: profile.allergies
      ? profile.allergies.split(',').map(s => s.trim()).filter(Boolean)
      : [],
    conditions,
    surgeries: (profile.surgeries ?? []).map(s => ({ name: s.name, notes: s.notes })),
    environment: profile.environment,
    livingWithAnimals: profile.livingWithAnimals,
    behavioralNotes: profile.behavioralNotes,
    vetQuestions: profile.vetQuestions,
  }
}

// ── MEDICAL PROFILES: cloud sync ─────────────────────────────────────────────

useEffect(() => {
  if (!ready || !isAuthenticated || !user.id) return

  let cancelled = false

  petsApi.getAll(user.id).then(async petsRes => {
    const pets = petsRes.data as any[]
    const results = await Promise.all(
      pets.map(async p => {
        try {
          const res = await medicalProfilesApi.get(p.id)
          // FIX: converte o formato da API para o formato local, em vez do
          // cast "as unknown as" que escondia a incompatibilidade
          return { petId: p.id, profile: fromApiProfile(res.data, p.id) }
        } catch {
          return null
        }
      }),
    )

    if (cancelled) return

    const profileMap: Record<string, PetMedicalProfile> = {}
    for (const r of results) {
      if (r && r.profile) profileMap[r.petId] = r.profile
    }

    if (Object.keys(profileMap).length > 0) {
      setProfiles(prev => {
        const merged = { ...prev, ...profileMap }
        if (user.id) saveLS(`pituti_profiles_${user.id}`, merged)
        return merged
      })
    }
  }).catch(() => { /* fica com localStorage */ })

  return () => { cancelled = true }
}, [ready, isAuthenticated, user.id])

const getMedicalProfile = useCallback(
  (petId: string): PetMedicalProfile =>
    profiles[petId] ?? { ...EMPTY_PROFILE, petId },
  [profiles],
)

const saveMedicalProfile = useCallback(
  (profile: PetMedicalProfile) => {
    const id = profile.petId
    if (!id) return
    // 1. Actualiza estado local
    setProfiles(prev => ({ ...prev, [id]: profile }))
    // 2. FIX: converte para o formato que a API realmente espera, em vez
    //    de enviar o objeto local diretamente
    medicalProfilesApi
      .upsert(id, toApiProfileDto(profile))
      .catch(() => { /* silencia — perfil está no localStorage */ })
  },
  [],
)


  // ── vetCalendarDates ──────────────────────────────────────────────────────────

  const vetCalendarDates: VetCalendarEvent[] = appointments.flatMap(a => {
    const events: VetCalendarEvent[] = []
    if (a.date) events.push({ date: a.date, kind: 'past', petId: a.petId, label: a.reason ?? a.vetName })
    if (a.nextAppointmentDate) events.push({ date: a.nextAppointmentDate, kind: 'next', petId: a.petId, label: a.nextAppointmentNote ?? a.vetName })
    return events
  })

  return (
    <VetContext.Provider value={{
      vets, loading, error, fetchVets, addVet, updateVet, deleteVet,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      getMedicalProfile, saveMedicalProfile,
      vetCalendarDates,
    }}>
      {children}
    </VetContext.Provider>
  )
}

// ── Safe fallback ─────────────────────────────────────────────────────────────

const SAFE_VET: VetContextValue = {
  vets: [], loading: false, error: null,
  fetchVets: async () => {},
  addVet: async () => ({ id: '', name: '', clinic: '', phone: '', type: 'primary', petIds: [], ownerId: '' } as Vet),
  updateVet: async () => {},
  deleteVet: async () => {},
  appointments: [],
  addAppointment: () => {},
  updateAppointment: () => {},
  deleteAppointment: () => {},
  getMedicalProfile: (petId: string) => ({ ...EMPTY_PROFILE, petId }),
  saveMedicalProfile: () => {},
  vetCalendarDates: [],
}

export function useVet(): VetContextValue {
  const ctx = useContext(VetContext)
  return ctx ?? SAFE_VET
}

// ── computePrescriptionStatus ─────────────────────────────────────────────────

type PrescriptionStatusInput = {
  status: 'active' | 'expiring' | 'expired' | 'used'
  expiresAt: string | null
}

export function computePrescriptionStatus(
  p: PrescriptionStatusInput,
): 'active' | 'expiring' | 'expired' | 'used' {
  if (p.status === 'used') return 'used'
  if (!p.expiresAt) return 'active'
  const msLeft = new Date(p.expiresAt).getTime() - Date.now()
  if (msLeft < 0) return 'expired'
  if (msLeft < 30 * 24 * 60 * 60 * 1000) return 'expiring'
  return 'active'
}
