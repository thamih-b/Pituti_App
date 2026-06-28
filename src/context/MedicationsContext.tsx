import React, {
  createContext, useContext, useState, useCallback, useEffect, useMemo,
} from 'react';
import { petsApi, medicationsApi } from '../api';
import type { CreateMedicationDto, UpdateMedicationDto } from '../api';
import { useUser } from './UserContext';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface MedRecord {
  id: string;
  petId: string;
  icon: string;
  title: string;
  dose: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
  bg: string;
  color: string;
  badge: string;
  badgeCls: string;
  archived: boolean;
}

interface MedicationsContextValue {
  active: MedRecord[];
  history: MedRecord[];
  loading: boolean;
  error: string | null;
  addMedication: (petId: string, data: Omit<MedRecord, 'id' | 'icon' | 'bg' | 'color' | 'badge' | 'badgeCls' | 'archived'>) => Promise<MedRecord>;
  updateMedication: (updated: MedRecord) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  archiveMedication: (id: string) => void;
  unarchiveMedication: (id: string) => void;
  markMedicationAdministered: (med: MedRecord, date: string, locale?: string) => string;
  refetch: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ICONS = ['💊', '💉', '🩺', '🧪', '🩹'];
const BG_COLORS = [
  'linear-gradient(135deg,#FFF3DC,#FFE0A0)',
  'linear-gradient(135deg,#E0F4FF,#B8E0FF)',
  'linear-gradient(135deg,#E8FFE8,#B8F0B8)',
  'linear-gradient(135deg,#F0E8FF,#DDD0FF)',
];

function deriveBadge(endDate: string): { badge: string; badgeCls: string } {
  if (!endDate) return { badge: 'Em curso', badgeCls: 'badge-green' };
  const msLeft = new Date(endDate + 'T12:00:00').getTime() - Date.now();
  if (msLeft < 0) return { badge: 'Concluído', badgeCls: 'badge-grey' };
  if (msLeft < 7 * 24 * 3600 * 1000) return { badge: 'A terminar', badgeCls: 'badge-yellow' };
  return { badge: 'Em curso', badgeCls: 'badge-green' };
}

function mapApiMedToRecord(api: any, petId: string): MedRecord {
  const { badge, badgeCls } = deriveBadge(api.endDate ?? '');
  return {
    id: api.id,
    petId,
    icon: ICONS[Math.abs(api.id.charCodeAt(0)) % ICONS.length],
    title: api.name ?? '',
    dose: api.dosage ?? '',
    frequency: api.frequency ?? '',
    startDate: api.startDate ?? '',
    endDate: api.endDate ?? '',
    notes: api.notes ?? '',
    bg: BG_COLORS[Math.abs(api.id.charCodeAt(0)) % BG_COLORS.length],
    color: 'var(--primary)',
    badge,
    badgeCls,
    archived: false,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

const MedicationsContext = createContext<MedicationsContextValue | null>(null);

export function MedicationsProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useUser();
  const [meds, setMeds] = useState<MedRecord[]>([]);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  // Carrega medicamentos de todos os pets do utilizador
  useEffect(() => {
    if (!isAuthenticated || !user.id) { setMeds([]); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);

    petsApi.getAll(user.id)
      .then(async (petsRes) => {
        const pets = petsRes.data;
        const results = await Promise.all(
          pets.map((p: any) =>
            medicationsApi
              .getAll(p.id)
              .then((r) => r.data.map((m: any) => mapApiMedToRecord(m, p.id)))
              .catch(() => [] as MedRecord[])
          )
        );
        if (!cancelled) setMeds(results.flat());
      })
      .catch((e) => { if (!cancelled) setError(e?.message ?? 'Erro ao carregar medicamentos'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [isAuthenticated, user.id, tick]);

  // active / history derivados
  const active = useMemo(
    () => meds.filter((m) => !archivedIds.has(m.id)),
    [meds, archivedIds]
  );
  const history = useMemo(
    () => meds.filter((m) => archivedIds.has(m.id)),
    [meds, archivedIds]
  );

  const addMedication = useCallback(
    async (petId: string, data: Omit<MedRecord, 'id' | 'icon' | 'bg' | 'color' | 'badge' | 'badgeCls' | 'archived'>): Promise<MedRecord> => {
      const dto: CreateMedicationDto = {
        name: data.title,
        dosage: data.dose,
        frequency: data.frequency,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        notes: data.notes || undefined,
      };
      const res = await medicationsApi.create(petId, dto);
      const created = mapApiMedToRecord(res.data, petId);
      setMeds((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateMedication = useCallback(async (updated: MedRecord): Promise<void> => {
    const dto: UpdateMedicationDto = {
      name: updated.title,
      dosage: updated.dose,
      frequency: updated.frequency,
      startDate: updated.startDate,
      endDate: updated.endDate || undefined,
      notes: updated.notes || undefined,
    };
    const res = await medicationsApi.update(updated.petId, updated.id, dto);
    const refreshed = mapApiMedToRecord(res.data, updated.petId);
    setMeds((prev) => prev.map((m) => (m.id === updated.id ? refreshed : m)));
  }, []);

  const deleteMedication = useCallback(async (id: string): Promise<void> => {
    const med = meds.find((m) => m.id === id);
    if (!med) return;
    await medicationsApi.delete(med.petId, id);
    setMeds((prev) => prev.filter((m) => m.id !== id));
    setArchivedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  }, [meds]);

  const archiveMedication = useCallback((id: string) => {
    setArchivedIds((prev) => new Set([...prev, id]));
  }, []);

  const unarchiveMedication = useCallback((id: string) => {
    setArchivedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  }, []);

  const markMedicationAdministered = useCallback(
    (med: MedRecord, date: string, locale = 'pt'): string => {
      return new Date(date + 'T12:00:00').toLocaleDateString(locale, {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    },
    []
  );

  return (
    <MedicationsContext.Provider
      value={{
        active, history, loading, error,
        addMedication, updateMedication, deleteMedication,
        archiveMedication, unarchiveMedication,
        markMedicationAdministered, refetch,
      }}
    >
      {children}
    </MedicationsContext.Provider>
  );
}

export function useMedications(): MedicationsContextValue {
  const ctx = useContext(MedicationsContext);
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider');
  return ctx;
}