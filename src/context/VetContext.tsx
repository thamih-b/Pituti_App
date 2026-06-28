import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { vetsApi } from '../api';
import type { CreateVetDto, UpdateVetDto } from '../api';
import { useUser } from './UserContext';

// ── Tipos exportados ───────────────────────────────────────────────────────────

export interface Vet {
  id: string;
  ownerId: string;
  name: string;
  clinic?: string | null;
  phone?: string | null;
  type?: 'primary' | 'specialist' | 'emergency' | 'other';
  specialty?: string | null;
  phone2?: string | null;
  address?: string | null;
  notes?: string | null;
  petIds: string[];
  createdAt?: string;
}

export interface VetAppointment {
  id: string;
  petId: string;
  type: string;
  date: string;
  createdAt: string;
  vetContactId?: string;
  vetName: string;
  clinic?: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  nextAppointmentDate?: string;
  nextAppointmentNote?: string;
  weightKg?: number;
  notes?: string;
}

export interface Surgery {
  id: string;
  name: string;
  date?: string;
  notes?: string;
}

export interface PetMedicalProfile {
  petId?: string;
  sex?: 'male' | 'female';
  neutered?: boolean;
  neuteredAge?: string;
  bloodType?: string;
  allergies?: string;
  chronicConditionIds: ('diabetes'|'hypothyroidism'|'hyperthyroidism'|'ckd'|'arthritis'|'hipdysplasia'|'cardiopathy'|'felv'|'fiv'|'epilepsy'|'lupus'|'atopy'|'blinddeaf')[];
  customConditions: string[];
  surgeries: Surgery[];
  environment?: 'apartment' | 'house' | 'both';
  livingWithAnimals?: boolean;
  parasiteControl?: string;
  behavioralNotes?: string;
  vetQuestions?: string;
  updatedAt?: string;
}

type VetCalendarEvent = {
  date: string;
  kind: 'past' | 'next';
  petId: string;
  label: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const EMPTY_PROFILE: Omit<PetMedicalProfile, 'petId'> = {
  chronicConditionIds: [],
  customConditions: [],
  surgeries: [],
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ── Context ────────────────────────────────────────────────────────────────────

interface VetContextValue {
  vets: Vet[];
  loading: boolean;
  error: string | null;
  fetchVets: () => Promise<void>;
  addVet: (data: Omit<Vet, 'id'>) => Promise<Vet>;
  updateVet: (vet: Vet) => Promise<void>;
  deleteVet: (id: string) => Promise<void>;
  appointments: VetAppointment[];
  addAppointment: (a: Omit<VetAppointment, 'id'>) => void;
  updateAppointment: (a: VetAppointment) => void;
  deleteAppointment: (id: string) => void;
  getMedicalProfile: (petId: string) => PetMedicalProfile;
  saveMedicalProfile: (profile: PetMedicalProfile) => void;
  vetCalendarDates: VetCalendarEvent[];
}

const VetContext = createContext<VetContextValue | null>(null);

export function VetProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUser();

  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Appointments e perfis médicos persistem em localStorage por utilizador
  const apptKey     = user.id ? `pituti_appointments_${user.id}` : null;
  const profilesKey = user.id ? `pituti_profiles_${user.id}` : null;

  const [appointments, setAppointments] = useState<VetAppointment[]>(() =>
    apptKey ? loadFromStorage<VetAppointment[]>(apptKey, []) : []
  );
  const [profiles, setProfiles] = useState<Record<string, PetMedicalProfile>>(() =>
    profilesKey ? loadFromStorage<Record<string, PetMedicalProfile>>(profilesKey, {}) : {}
  );

  // Recarrega do storage quando o user muda
  useEffect(() => {
    if (!user.id) { setAppointments([]); setProfiles({}); return; }
    setAppointments(loadFromStorage<VetAppointment[]>(`pituti_appointments_${user.id}`, []));
    setProfiles(loadFromStorage<Record<string, PetMedicalProfile>>(`pituti_profiles_${user.id}`, {}));
  }, [user.id]);

  // Persiste appointments
  useEffect(() => {
    if (apptKey) saveToStorage(apptKey, appointments);
  }, [appointments, apptKey]);

  // Persiste profiles
  useEffect(() => {
    if (profilesKey) saveToStorage(profilesKey, profiles);
  }, [profiles, profilesKey]);

  // ── Vets ───────────────────────────────────────────────────────────────────

  const fetchVets = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await vetsApi.getAll();
      setVets(res.data as unknown as Vet[]);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar veterinários');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchVets();
    else setVets([]);
  }, [isAuthenticated, fetchVets]);

  const addVet = async (data: Omit<Vet, 'id'>): Promise<Vet> => {
    const res = await vetsApi.create(data as unknown as CreateVetDto);
    const v = res.data as unknown as Vet;
    setVets((prev) => [v, ...prev]);
    return v;
  };

  const updateVet = async (vet: Vet): Promise<void> => {
    const res = await vetsApi.update(vet.id, vet as unknown as UpdateVetDto);
    const u = res.data as unknown as Vet;
    setVets((prev) => prev.map((v) => (v.id === vet.id ? u : v)));
  };

  const deleteVet = async (id: string): Promise<void> => {
    await vetsApi.delete(id);
    setVets((prev) => prev.filter((v) => v.id !== id));
  };

  // ── Appointments ───────────────────────────────────────────────────────────

  const addAppointment = useCallback((a: Omit<VetAppointment, 'id'>) => {
    const newA: VetAppointment = { ...a, id: `appt-${Date.now()}` };
    setAppointments((prev) => [newA, ...prev]);
  }, []);

  const updateAppointment = useCallback((a: VetAppointment) => {
    setAppointments((prev) => prev.map((x) => (x.id === a.id ? a : x)));
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // ── Medical profiles ───────────────────────────────────────────────────────

  const getMedicalProfile = useCallback(
    (petId: string): PetMedicalProfile =>
      profiles[petId] ?? { ...EMPTY_PROFILE, petId },
    [profiles]
  );

  const saveMedicalProfile = useCallback((profile: PetMedicalProfile) => {
    const id = profile.petId;
    if (!id) return;
    setProfiles((prev) => ({ ...prev, [id]: profile }));
  }, []);
  // ── vetCalendarDates (derivado dos appointments) ───────────────────────────

  const vetCalendarDates: VetCalendarEvent[] = appointments.flatMap((a) => {
    const events: VetCalendarEvent[] = [];
    if (a.date) {
      events.push({ date: a.date, kind: 'past', petId: a.petId, label: a.reason ?? a.vetName });
    }
    if (a.nextAppointmentDate) {
      events.push({
        date: a.nextAppointmentDate, kind: 'next',
        petId: a.petId, label: a.nextAppointmentNote ?? a.vetName,
      });
    }
    return events;
  });

  return (
    <VetContext.Provider value={{
      vets, loading, error, fetchVets, addVet, updateVet, deleteVet,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      getMedicalProfile, saveMedicalProfile,
      vetCalendarDates,
    }}>
      {children}
    </VetContext.Provider>
  );
}

export function useVet(): VetContextValue {
  const ctx = useContext(VetContext);
  if (!ctx) throw new Error('useVet must be used within VetProvider');
  return ctx;
}

// ── computePrescriptionStatus (usado por TabPrescriptions) ────────────────────

type PrescriptionStatusInput = {
  status: 'active' | 'expiring' | 'expired' | 'used';
  expiresAt: string | null;
};

export function computePrescriptionStatus(
  p: PrescriptionStatusInput
): 'active' | 'expiring' | 'expired' | 'used' {
  if (p.status === 'used') return 'used';
  if (!p.expiresAt) return 'active';
  const msLeft = new Date(p.expiresAt).getTime() - Date.now();
  if (msLeft < 0) return 'expired';
  if (msLeft < 30 * 24 * 60 * 60 * 1000) return 'expiring';
  return 'active';
}