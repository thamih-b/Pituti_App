import { api } from './client'
import type { LoginDto, RegisterDto, AuthResponse } from './types'

export const authApi = {
  login: (dto: LoginDto) => api.post<AuthResponse['data']>('/auth/login', dto),
  register: (dto: RegisterDto) => api.post<AuthResponse['data']>('/auth/register', dto),
}