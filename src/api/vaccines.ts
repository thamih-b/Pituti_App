import { api } from './client';
import type { ApiVaccine, CreateVaccineDto, UpdateVaccineDto } from './types';

export const vaccinesApi = {
  getAll:  (petId: string)                             => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`),
  getById: (petId: string, id: string)                 => api.get<ApiVaccine>(`/pets/${petId}/vaccines/${id}`),
  create:  (petId: string, dto: CreateVaccineDto)      => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, dto),
  update:  (petId: string, id: string, dto: UpdateVaccineDto) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, dto),
  delete:  (petId: string, id: string)                 => api.delete<void>(`/pets/${petId}/vaccines/${id}`),
};
