import { api } from './client'
import type { ApiVet, CreateVetDto, UpdateVetDto } from './types'

export const vetsApi = {
  getAll: () => api.get<ApiVet[]>('/vets'),
  getById: (vetId: string) => api.get<ApiVet>(`/vets/${vetId}`),
  create: (dto: CreateVetDto) => api.post<ApiVet>('/vets', dto),
  update: (vetId: string, dto: UpdateVetDto) =>
    api.patch<ApiVet>(`/vets/${vetId}`, dto),
  delete: (vetId: string) => api.delete<void>(`/vets/${vetId}`),
}