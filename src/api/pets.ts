import { api } from './client';
import type { ApiPet, CreatePetDto, UpdatePetDto } from './types';

export const petsApi = {
  getAll:  (ownerId?: string) => api.get<ApiPet[]>(`/pets${ownerId ? `?ownerId=${ownerId}` : ''}`),
  getById: (petId: string)    => api.get<ApiPet>(`/pets/${petId}`),
  create:  (dto: CreatePetDto)             => api.post<ApiPet>('/pets', dto),
  update:  (petId: string, dto: UpdatePetDto) => api.patch<ApiPet>(`/pets/${petId}`, dto),
  delete:  (petId: string)                 => api.delete<void>(`/pets/${petId}`),
};
