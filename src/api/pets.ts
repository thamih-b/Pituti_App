import type { Pet } from "../types";
import { apiFetch } from "./client";

// src/api/pets.ts
export const petsApi = {
  getAll: (ownerId?: string) =>
    apiFetch<{ data: Pet[] }>(`/pets${ownerId ? `?ownerId=${ownerId}` : ''}`),
  create: (body: Omit<Pet, 'id' | 'createdAt'>) =>
    apiFetch<{ data: Pet }>('/pets', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Pet>) =>
    apiFetch<{ data: Pet }>(`/pets/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) =>
    apiFetch<void>(`/pets/${id}`, { method: 'DELETE' }),
};