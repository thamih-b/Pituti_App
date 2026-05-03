import { api } from './client';
import type { ApiAppointment, CreateAppointmentDto, UpdateAppointmentDto } from './types';

export const appointmentsApi = {
  getAll:  (vetId: string)                                        => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`),
  getById: (vetId: string, id: string)                            => api.get<ApiAppointment>(`/vets/${vetId}/appointments/${id}`),
  create:  (vetId: string, dto: CreateAppointmentDto)             => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, dto),
  update:  (vetId: string, id: string, dto: UpdateAppointmentDto) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, dto),
  delete:  (vetId: string, id: string)                            => api.delete<void>(`/vets/${vetId}/appointments/${id}`),
};
