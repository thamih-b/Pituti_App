import {api} from './client'
import type { ApiMedicalProfile, UpsertMedicalProfileDto } from './types'
import { mapApiMedicalProfile, toApiMedicalProfileDto } from './mappers'

export const medicalProfilesApi = {
  async get(petId: string) {
    const res = await api.get<any>(`/pets/${petId}/medical-profile`)
    return { ...res, data: mapApiMedicalProfile(res.data) as ApiMedicalProfile }
  },

  async upsert(petId: string, dto: UpsertMedicalProfileDto) {
    const res = await api.put<any>(
      `/pets/${petId}/medical-profile`,
      toApiMedicalProfileDto(dto),
    )
    return { ...res, data: mapApiMedicalProfile(res.data) as ApiMedicalProfile }
  },
}