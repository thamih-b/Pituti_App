import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { usePetsContext } from "./PetsContext";
import { getVaccStatus } from "../utils/vaccUtils";
import type { VaccineRecord } from "../utils/vaccUtils";
import { vaccinesApi } from "../api";

export type VaccStatus = "ok" | "soon" | "late";

export interface VaccineWithMeta extends VaccineRecord {
  cls: VaccStatus;
  petName: string;
  petEmoji: string;
  petId: string;
}

const PET_EMOJI: Record<string, string> = {
  cat: "🐱", dog: "🐶", bird: "🐦", rabbit: "🐰", reptile: "🦎", fish: "🐠", other: "🐾",
};

const BADGE_MAP: Record<VaccStatus, { badge: string; badgeCls: string }> = {
  ok:   { badge: "Em dia",        badgeCls: "badge-green"  },
  soon: { badge: "Vence em breve", badgeCls: "badge-yellow" },
  late: { badge: "Expirada",       badgeCls: "badge-red"    },
};

function toVaccineRecord(api: Record<string, unknown>): VaccineRecord {
  const nextDate = String(api.nextdue ?? api.nextDate ?? api.nextdate ?? "");
  const name     = String(api.vaccinename ?? api.name ?? "");
  const applied  = String(api.dateapplied ?? api.applied ?? api.date ?? "");
  const cls      = getVaccStatus(nextDate) as VaccStatus;
  return {
    id:       String(api.id ?? ""),
    name,
    applied:  applied
      ? new Date(applied + "T12:00:00").toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
      : "",
    nextDate,
    badge:    BADGE_MAP[cls].badge,
    badgeCls: BADGE_MAP[cls].badgeCls,
  };
}

interface VaccinesContextValue {
  vaccinesByPet: Record<string, VaccineRecord[]>;
  allVaccines: VaccineWithMeta[];
  loading: boolean;
  error: string | null;
  addVaccine: (petId: string, v: VaccineRecord) => void;
  updateVaccine: (petId: string, v: VaccineRecord) => void;
  deleteVaccine: (petId: string, vaccineId: string) => Promise<void>;
  refetch: () => void;
}

const VaccinesContext = createContext<VaccinesContextValue | null>(null);

export function VaccinesProvider({ children }: { children: ReactNode }) {
  const { pets } = usePetsContext();
  const [vaccinesByPet, setVaccinesByPet] = useState<Record<string, VaccineRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!pets.length) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    Promise.all(
      pets.map((p) =>
        vaccinesApi
          .getAll(p.id)
          .then((r) => ({ petId: p.id, data: (r.data as unknown[]).map((raw) => toVaccineRecord(raw as Record<string, unknown>)) }))
          .catch(() => ({ petId: p.id, data: [] as VaccineRecord[] }))
      )
    )
      .then((results) => {
        const map: Record<string, VaccineRecord[]> = {};
        results.forEach((r) => (map[r.petId] = r.data));
        setVaccinesByPet(map);
      })
      .catch((err) => setError(err?.message ?? "Erro ao carregar vacinas"))
      .finally(() => setLoading(false));
  }, [pets]);

  useEffect(() => { load(); }, [load]);

  const allVaccines: VaccineWithMeta[] = pets.flatMap((p) =>
    (vaccinesByPet[p.id] ?? []).map((v) => ({
      ...v,
      cls: getVaccStatus(v.nextDate) as VaccStatus,
      petName: p.name,
      petEmoji: PET_EMOJI[p.species] ?? "🐾",
      petId: p.id,
    }))
  );

  const addVaccine = useCallback(
    (petId: string, v: VaccineRecord) =>
      setVaccinesByPet((prev) => ({ ...prev, [petId]: [...(prev[petId] ?? []), v] })),
    []
  );

  const deleteVaccine = useCallback(async (petId: string, vaccineId: string) => {
    await vaccinesApi.delete(petId, vaccineId);
    setVaccinesByPet((prev) => ({ ...prev, [petId]: (prev[petId] ?? []).filter((v) => v.id !== vaccineId) }));
  }, []);

  const updateVaccine = useCallback(
    (petId: string, v: VaccineRecord) =>
      setVaccinesByPet((prev) => ({ ...prev, [petId]: (prev[petId] ?? []).map((x) => (x.id === v.id ? v : x)) })),
    []
  );

  return (
    <VaccinesContext.Provider value={{ vaccinesByPet, allVaccines, loading, error, addVaccine, updateVaccine, deleteVaccine, refetch: load }}>
      {children}
    </VaccinesContext.Provider>
  );
}

export function useVaccinesContext() {
  const ctx = useContext(VaccinesContext);
  if (!ctx) throw new Error("useVaccinesContext must be inside VaccinesProvider");
  return ctx;
}
