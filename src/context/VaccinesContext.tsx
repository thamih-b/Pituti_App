import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDueDate?: string | null;
  veterinary?: string | null;
  notes?: string | null;
  createdAt?: string;
}

interface VaccinesContextValue {
  vaccines: Vaccine[];
  loading: boolean;
  error: string | null;
  fetchVaccines: (petId: string) => Promise<void>;
  addVaccine: (petId: string, data: Omit<Vaccine, 'id' | 'petId' | 'createdAt'>) => Promise<Vaccine>;
  updateVaccine: (petId: string, id: string, data: Partial<Vaccine>) => Promise<Vaccine>;
  deleteVaccine: (petId: string, id: string) => Promise<void>;
}

const VaccinesContext = createContext<VaccinesContextValue | null>(null);

export function VaccinesProvider({ children }: { children: React.ReactNode }) {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVaccines = useCallback(async (petId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Vaccine[] }>(`/api/pets/${petId}/vaccines`);
      setVaccines(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar vacinas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addVaccine = async (petId: string, data: Omit<Vaccine, 'id' | 'petId' | 'createdAt'>): Promise<Vaccine> => {
    const res = await apiClient.post<{ data: Vaccine }>(`/api/pets/${petId}/vaccines`, data);
    const v = res.data.data;
    setVaccines((prev) => [v, ...prev]);
    return v;
  };

  const updateVaccine = async (petId: string, id: string, data: Partial<Vaccine>): Promise<Vaccine> => {
    const res = await apiClient.patch<{ data: Vaccine }>(`/api/pets/${petId}/vaccines/${id}`, data);
    const u = res.data.data;
    setVaccines((prev) => prev.map((v) => (v.id === id ? u : v)));
    return u;
  };

  const deleteVaccine = async (petId: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/pets/${petId}/vaccines/${id}`);
    setVaccines((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <VaccinesContext.Provider value={{ vaccines, loading, error, fetchVaccines, addVaccine, updateVaccine, deleteVaccine }}>
      {children}
    </VaccinesContext.Provider>
  );
}

export function useVaccines(): VaccinesContextValue {
  const ctx = useContext(VaccinesContext);
  if (!ctx) throw new Error('useVaccines must be used within VaccinesProvider');
  return ctx;
}
