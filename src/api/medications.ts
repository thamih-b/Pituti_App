import { api } from './client';
import type { ApiMedication, CreateMedicationDto, UpdateMedicationDto } from './types';

export const medicationsApi = {
  getAll:  (petId: string)                                    => api.get<ApiMedication[]>(`/pets/${petId}/medications`),
  getById: (petId: string, id: string)                        => api.get<ApiMedication>(`/pets/${petId}/medications/${id}`),
  create:  (petId: string, dto: CreateMedicationDto)          => api.post<ApiMedication>(`/pets/${petId}/medications`, dto),
  update:  (petId: string, id: string, dto: UpdateMedicationDto) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, dto),
  delete:  (petId: string, id: string)                        => api.delete<void>(`/pets/${petId}/medications/${id}`),
};
