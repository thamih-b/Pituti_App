import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { vetsApi } from '../api';
import type { CreateVetDto, UpdateVetDto } from '../api';
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
      const res = await vetsApi.getAll();
      // vetsApi.getAll devolve { data: ApiVet[], ... } onde data é o array
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

  const addVet = async (data: Omit<Vet, 'id' | 'ownerId' | 'createdAt'>): Promise<Vet> => {
    const res = await vetsApi.create(data as unknown as CreateVetDto);
    const v = res.data as unknown as Vet;
    setVets((prev) => [v, ...prev]);
    return v;
  };

  const updateVet = async (id: string, data: Partial<Vet>): Promise<Vet> => {
    const res = await vetsApi.update(id, data as unknown as UpdateVetDto);
    const u = res.data as unknown as Vet;
    setVets((prev) => prev.map((v) => (v.id === id ? u : v)));
    return u;
  };

  const deleteVet = async (id: string): Promise<void> => {
    await vetsApi.delete(id);
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