import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage?: string | null;
  frequency?: string | null;
  startDate: string;
  endDate?: string | null;
  notes?: string | null;
  createdAt?: string;
}

interface MedicationsContextValue {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  fetchMedications: (petId: string) => Promise<void>;
  addMedication: (petId: string, data: Omit<Medication, 'id' | 'petId' | 'createdAt'>) => Promise<Medication>;
  updateMedication: (petId: string, id: string, data: Partial<Medication>) => Promise<Medication>;
  deleteMedication: (petId: string, id: string) => Promise<void>;
}

const MedicationsContext = createContext<MedicationsContextValue | null>(null);

export function MedicationsProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async (petId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Medication[] }>(`/api/pets/${petId}/medications`);
      setMedications(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar medicamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMedication = async (petId: string, data: Omit<Medication, 'id' | 'petId' | 'createdAt'>): Promise<Medication> => {
    const res = await apiClient.post<{ data: Medication }>(`/api/pets/${petId}/medications`, data);
    const m = res.data.data;
    setMedications((prev) => [m, ...prev]);
    return m;
  };

  const updateMedication = async (petId: string, id: string, data: Partial<Medication>): Promise<Medication> => {
    const res = await apiClient.patch<{ data: Medication }>(`/api/pets/${petId}/medications/${id}`, data);
    const u = res.data.data;
    setMedications((prev) => prev.map((m) => (m.id === id ? u : m)));
    return u;
  };

  const deleteMedication = async (petId: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/pets/${petId}/medications/${id}`);
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MedicationsContext.Provider value={{ medications, loading, error, fetchMedications, addMedication, updateMedication, deleteMedication }}>
      {children}
    </MedicationsContext.Provider>
  );
}

export function useMedications(): MedicationsContextValue {
  const ctx = useContext(MedicationsContext);
  if (!ctx) throw new Error('useMedications must be used within MedicationsProvider');
  return ctx;
}
