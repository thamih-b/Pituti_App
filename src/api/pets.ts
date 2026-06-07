import {api} from './client'
import type { ApiPet, CreatePetDto, UpdatePetDto } from './types'
import { mapApiPet, toApiCreatePetDto, toApiUpdatePetDto } from './mappers'

export const petsApi = {
async getAll(ownerId: string) {
  const res = await api.get<any[]>(`/pets?ownerId=${ownerId}`)
  return { ...res, data: res.data.map(mapApiPet) as ApiPet[] }
},

  async getById(id: string) {
    const res = await api.get<any>(`/pets/${id}`)
    return { ...res, data: mapApiPet(res.data) as ApiPet }
  },

  async create(dto: CreatePetDto) {
    const res = await api.post<any>('/pets', toApiCreatePetDto(dto))
    return { ...res, data: mapApiPet(res.data) as ApiPet }
  },

  async update(id: string, dto: UpdatePetDto) {
    const res = await api.patch<any>(`/pets/${id}`, toApiUpdatePetDto(dto))
    return { ...res, data: mapApiPet(res.data) as ApiPet }
  },

  delete(id: string) {
    return api.delete<void>(`/pets/${id}`)
  },
}