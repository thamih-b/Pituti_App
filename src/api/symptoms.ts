import {api} from './client'
import type { ApiSymptom, CreateSymptomDto, UpdateSymptomDto } from './types'
import { mapApiSymptom, toApiCreateSymptomDto, toApiUpdateSymptomDto } from './mappers'

export const symptomsApi = {
  async getAll(petId: string) {
    const res = await api.get<any[]>(`/pets/${petId}/symptoms`)
    return { ...res, data: res.data.map(mapApiSymptom) as ApiSymptom[] }
  },

  async getById(petId: string, id: string) {
    const res = await api.get<any>(`/pets/${petId}/symptoms/${id}`)
    return { ...res, data: mapApiSymptom(res.data) as ApiSymptom }
  },

  async create(petId: string, dto: CreateSymptomDto) {
    const res = await api.post<any>(`/pets/${petId}/symptoms`, toApiCreateSymptomDto(dto))
    return { ...res, data: mapApiSymptom(res.data) as ApiSymptom }
  },

  async update(petId: string, id: string, dto: UpdateSymptomDto) {
    const res = await api.patch<any>(
      `/pets/${petId}/symptoms/${id}`,
      toApiUpdateSymptomDto(dto),
    )
    return { ...res, data: mapApiSymptom(res.data) as ApiSymptom }
  },

  delete(petId: string, id: string) {
    return api.delete<void>(`/pets/${petId}/symptoms/${id}`)
  },
}