import { api } from './client';
import type { ApiCare, CreateCareDto, UpdateCareDto } from './types';

export const caresApi = {
  getAll:  (petId: string)                               => api.get<ApiCare[]>(`/pets/${petId}/cares`),
  getById: (petId: string, id: string)                   => api.get<ApiCare>(`/pets/${petId}/cares/${id}`),
  create:  (petId: string, dto: CreateCareDto)           => api.post<ApiCare>(`/pets/${petId}/cares`, dto),
  update:  (petId: string, id: string, dto: UpdateCareDto) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, dto),
  delete:  (petId: string, id: string)                   => api.delete<void>(`/pets/${petId}/cares/${id}`),
};
