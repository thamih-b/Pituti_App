import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

export interface Care {
  id: string;
  petId: string;
  name: string;
  type: string;
  frequency?: string | null;
  periodType?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  time?: string | null;
  notes?: string | null;
  status?: string | null;
  createdAt?: string;
}

interface CaresContextValue {
  cares: Care[];
  loading: boolean;
  error: string | null;
  fetchCares: (petId: string) => Promise<void>;
  addCare: (petId: string, data: Omit<Care, 'id' | 'petId' | 'createdAt'>) => Promise<Care>;
  updateCare: (petId: string, id: string, data: Partial<Care>) => Promise<Care>;
  deleteCare: (petId: string, id: string) => Promise<void>;
}

const CaresContext = createContext<CaresContextValue | null>(null);

export function CaresProvider({ children }: { children: React.ReactNode }) {
  const [cares, setCares] = useState<Care[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCares = useCallback(async (petId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Care[] }>(`/api/pets/${petId}/cares`);
      setCares(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar cuidados');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCare = async (petId: string, data: Omit<Care, 'id' | 'petId' | 'createdAt'>): Promise<Care> => {
    const res = await apiClient.post<{ data: Care }>(`/api/pets/${petId}/cares`, data);
    const c = res.data.data;
    setCares((prev) => [c, ...prev]);
    return c;
  };

  const updateCare = async (petId: string, id: string, data: Partial<Care>): Promise<Care> => {
    const res = await apiClient.patch<{ data: Care }>(`/api/pets/${petId}/cares/${id}`, data);
    const u = res.data.data;
    setCares((prev) => prev.map((c) => (c.id === id ? u : c)));
    return u;
  };

  const deleteCare = async (petId: string, id: string): Promise<void> => {
    await apiClient.delete(`/api/pets/${petId}/cares/${id}`);
    setCares((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CaresContext.Provider value={{ cares, loading, error, fetchCares, addCare, updateCare, deleteCare }}>
      {children}
    </CaresContext.Provider>
  );
}

export function useCares(): CaresContextValue {
  const ctx = useContext(CaresContext);
  if (!ctx) throw new Error('useCares must be used within CaresProvider');
  return ctx;
}
