import {api} from './client'
import type { ApiVaccine, CreateVaccineDto, UpdateVaccineDto } from './types'
import { mapApiVaccine, toApiCreateVaccineDto, toApiUpdateVaccineDto } from './mappers'

const vaccinesApi = {
  async getAll(petId: string) {
    const res = await api.get<any[]>(`/pets/${petId}/vaccines`)
    return { ...res, data: res.data.map(mapApiVaccine) as ApiVaccine[] }
  },

  async create(petId: string, dto: CreateVaccineDto) {
    const res = await api.post<any>(`/pets/${petId}/vaccines`, toApiCreateVaccineDto(dto))
    return { ...res, data: mapApiVaccine(res.data) as ApiVaccine }
  },

  async update(petId: string, vaccineId: string, dto: UpdateVaccineDto) {
    const res = await api.patch<any>(
      `/pets/${petId}/vaccines/${vaccineId}`,
      toApiUpdateVaccineDto(dto),
    )
    return { ...res, data: mapApiVaccine(res.data) as ApiVaccine }
  },

  delete(petId: string, vaccineId: string) {
    return api.delete<void>(`/pets/${petId}/vaccines/${vaccineId}`)
  },
}

export default vaccinesApi