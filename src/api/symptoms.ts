import { api } from './client';
import type { ApiSymptom, CreateSymptomDto, UpdateSymptomDto } from './types';

export const symptomsApi = {
  getAll:  (petId: string)                                  => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`),
  getById: (petId: string, id: string)                      => api.get<ApiSymptom>(`/pets/${petId}/symptoms/${id}`),
  create:  (petId: string, dto: CreateSymptomDto)           => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, dto),
  update:  (petId: string, id: string, dto: UpdateSymptomDto) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, dto),
  delete:  (petId: string, id: string)                      => api.delete<void>(`/pets/${petId}/symptoms/${id}`),
};
