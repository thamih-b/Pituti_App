import {api} from './client'
import type { ApiCare, CreateCareDto, UpdateCareDto } from './types'
import { mapApiCare, toApiCreateCareDto, toApiUpdateCareDto } from './mappers'

export const caresApi = {
  async getAll(petId: string) {
    const res = await api.get<any[]>(`/pets/${petId}/cares`)
    return { ...res, data: res.data.map(mapApiCare) as ApiCare[] }
  },

  async getById(petId: string, id: string) {
    const res = await api.get<any>(`/pets/${petId}/cares/${id}`)
    return { ...res, data: mapApiCare(res.data) as ApiCare }
  },

  async create(petId: string, dto: CreateCareDto) {
    const res = await api.post<any>(`/pets/${petId}/cares`, toApiCreateCareDto(dto))
    return { ...res, data: mapApiCare(res.data) as ApiCare }
  },

  async update(petId: string, id: string, dto: UpdateCareDto) {
    const res = await api.patch<any>(`/pets/${petId}/cares/${id}`, toApiUpdateCareDto(dto))
    return { ...res, data: mapApiCare(res.data) as ApiCare }
  },

  delete(petId: string, id: string) {
    return api.delete<void>(`/pets/${petId}/cares/${id}`)
  },
}