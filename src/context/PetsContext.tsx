import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { useUser } from './UserContext';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: string | null;
  photoUrl?: string | null;
  color?: string | null;
  microchip?: string | null;
  passport?: string | null;
  ownerId: string;
  createdAt?: string;
}

interface PetsContextValue {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addPet: (data: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>) => Promise<Pet>;
  updatePet: (id: string, data: Partial<Pet>) => Promise<Pet>;
  deletePet: (id: string) => Promise<void>;
}

const PetsContext = createContext<PetsContextValue | null>(null);

export function PetsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Pet[] }>('/api/pets');
      setPets(res.data.data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar pets');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) refresh();
    else setPets([]);
  }, [isAuthenticated, refresh]);

  const addPet = async (data: Omit<Pet, 'id' | 'ownerId' | 'createdAt'>): Promise<Pet> => {
    const res = await apiClient.post<{ data: Pet }>('/api/pets', data);
    const p = res.data.data;
    setPets((prev) => [p, ...prev]);
    return p;
  };

  const updatePet = async (id: string, data: Partial<Pet>): Promise<Pet> => {
    const res = await apiClient.patch<{ data: Pet }>(`/api/pets/${id}`, data);
    const u = res.data.data;
    setPets((prev) => prev.map((p) => (p.id === id ? u : p)));
    return u;
  };

  const deletePet = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/pets/${id}`);
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PetsContext.Provider value={{ pets, loading, error, refresh, addPet, updatePet, deletePet }}>
      {children}
    </PetsContext.Provider>
  );
}

export function usePets(): PetsContextValue {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error('usePets must be used within PetsProvider');
  return ctx;
}
