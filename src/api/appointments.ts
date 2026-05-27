import {api} from './client'
import type { ApiAppointment, CreateAppointmentDto, UpdateAppointmentDto } from './types'
import {
  mapApiAppointment,
  toApiCreateAppointmentDto,
  toApiUpdateAppointmentDto,
} from './mappers'

export const appointmentsApi = {
  async getAll(vetId: string) {
    const res = await api.get<any[]>(`/vets/${vetId}/appointments`)
    return { ...res, data: res.data.map(mapApiAppointment) as ApiAppointment[] }
  },

  async getById(vetId: string, id: string) {
    const res = await api.get<any>(`/vets/${vetId}/appointments/${id}`)
    return { ...res, data: mapApiAppointment(res.data) as ApiAppointment }
  },

  async create(vetId: string, dto: CreateAppointmentDto) {
    const res = await api.post<any>(
      `/vets/${vetId}/appointments`,
      toApiCreateAppointmentDto(dto),
    )
    return { ...res, data: mapApiAppointment(res.data) as ApiAppointment }
  },

  async update(vetId: string, id: string, dto: UpdateAppointmentDto) {
    const res = await api.patch<any>(
      `/vets/${vetId}/appointments/${id}`,
      toApiUpdateAppointmentDto(dto),
    )
    return { ...res, data: mapApiAppointment(res.data) as ApiAppointment }
  },

  delete(vetId: string, id: string) {
    return api.delete<void>(`/vets/${vetId}/appointments/${id}`)
  },
}