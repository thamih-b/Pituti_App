import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useUser } from './UserContext';

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
  petIds?: string[];
  createdAt?: string;
}

interface VetContextValue {
  vets: Vet[];
  loading: boolean;
  error: string | null;
  fetchVets: () => Promise<void>;
  addVet: (data: Omit<Vet, 'id' | 'ownerId' | 'createdAt'>) => Promise<Vet>;
  updateVet: (id: string, data: Partial<Vet>) => Promise<Vet>;
  deleteVet: (id: string) => Promise<void>;
}

const VetContext = createContext<VetContextValue | null>(null);

export function VetProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVets = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Vet[] }>('/api/vets');
      setVets(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar veterinários');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchVets();
    else setVets([]);
  }, [isAuthenticated, fetchVets]);

  const addVet = async (data: Omit<Vet, 'id' | 'ownerId' | 'createdAt'>): Promise<Vet> => {
    const res = await apiClient.post<{ data: Vet }>('/api/vets', data);
    const v = res.data.data;
    setVets((prev) => [v, ...prev]);
    return v;
  };

  const updateVet = async (id: string, data: Partial<Vet>): Promise<Vet> => {
    const res = await apiClient.patch<{ data: Vet }>(`/api/vets/${id}`, data);
    const u = res.data.data;
    setVets((prev) => prev.map((v) => (v.id === id ? u : v)));
    return u;
  };

  const deleteVet = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/vets/${id}`);
    setVets((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <VetContext.Provider value={{ vets, loading, error, fetchVets, addVet, updateVet, deleteVet }}>
      {children}
    </VetContext.Provider>
  );
}

export function useVet(): VetContextValue {
  const ctx = useContext(VetContext);
  if (!ctx) throw new Error('useVet must be used within VetProvider');
  return ctx;
}
