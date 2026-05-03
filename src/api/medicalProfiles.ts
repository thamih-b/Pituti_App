import { api } from './client';
import type { ApiMedicalProfile, UpsertMedicalProfileDto } from './types';

export const medicalProfilesApi = {
  get:    (petId: string)                          => api.get<ApiMedicalProfile>(`/pets/${petId}/medical-profile`),
  upsert: (petId: string, dto: UpsertMedicalProfileDto) => api.put<ApiMedicalProfile>(`/pets/${petId}/medical-profile`, dto),
};
