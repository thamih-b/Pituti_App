import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export interface Symptom {
  id: string;
  petId: string;
  description: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  date: string;
  notes?: string | null;
  resolved?: boolean;
  createdAt?: string;
}

interface SymptomsContextValue {
  symptoms: Symptom[];
  loading: boolean;
  error: string | null;
  fetchSymptoms: (petId: string) => Promise<void>;
  addSymptom: (petId: string, data: Omit<Symptom, 'id' | 'petId' | 'createdAt'>) => Promise<Symptom>;
  updateSymptom: (petId: string, id: string, data: Partial<Symptom>) => Promise<Symptom>;
  deleteSymptom: (petId: string, id: string) => Promise<void>;
}

const SymptomsContext = createContext<SymptomsContextValue | null>(null);

export function SymptomsProvider({ children }: { children: React.ReactNode }) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSymptoms = useCallback(async (petId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Symptom[] }>(`/api/pets/${petId}/symptoms`);
      setSymptoms(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar sintomas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSymptom = async (petId: string, data: Omit<Symptom, 'id' | 'petId' | 'createdAt'>): Promise<Symptom> => {
    const res = await apiClient.post<{ data: Symptom }>(`/api/pets/${petId}/symptoms`, data);
    const s = res.data.data;
    setSymptoms((prev) => [s, ...prev]);
    return s;
  };

  const updateSymptom = async (petId: string, id: string, data: Partial<Symptom>): Promise<Symptom> => {
    const res = await apiClient.patch<{ data: Symptom }>(`/api/pets/${petId}/symptoms/${id}`, data);
    const u = res.data.data;
    setSymptoms((prev) => prev.map((s) => (s.id === id ? u : s)));
    return u;
  };

  const deleteSymptom = async (petId: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/pets/${petId}/symptoms/${id}`);
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SymptomsContext.Provider value={{ symptoms, loading, error, fetchSymptoms, addSymptom, updateSymptom, deleteSymptom }}>
      {children}
    </SymptomsContext.Provider>
  );
}

export function useSymptoms(): SymptomsContextValue {
  const ctx = useContext(SymptomsContext);
  if (!ctx) throw new Error('useSymptoms must be used within SymptomsProvider');
  return ctx;
}
