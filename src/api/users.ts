import { api } from './client'
import type { ApiUser, CreateUserDto, UpdateUserDto } from './types'

export const usersApi = {
  getAll: () => api.get<ApiUser[]>('/users'),
  getById: (id: string) => api.get<ApiUser>(`/users/${id}`),
  create: (dto: CreateUserDto) => api.post<ApiUser>('/users', dto),
  update: (id: string, dto: UpdateUserDto) =>
    api.patch<ApiUser>(`/users/${id}`, dto),
  delete: (id: string) => api.delete<void>(`/users/${id}`),
}