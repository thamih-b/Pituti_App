import { api } from './client';
import type { ApiVaccine, CreateVaccineDto, UpdateVaccineDto } from './types';


const vaccinesApi = {
  getAll: (petId: string) => api.get(`/pets/${petId}/vaccines`),

  create: (petId: string, data: {
    name: string
    date: string
    nextduedate?: string | null
    veterinary?: string | null
    notes?: string | null
  }) => api.post(`/pets/${petId}/vaccines`, data),

  update: (petId: string, vaccineId: string, data: {
    name?: string
    date?: string
    nextDueDate?: string | null
    veterinary?: string | null
    notes?: string | null
  }) => api.patch(`/pets/${petId}/vaccines/${vaccineId}`, data),

  delete: (petId: string, vaccineId: string) =>
    api.delete(`/pets/${petId}/vaccines/${vaccineId}`),
}

export default vaccinesApi
