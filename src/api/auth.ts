import { apiClient } from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoUrl?: string | null;
}

export const authApi = {
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ data: AuthUser; token: string }> {
    const res = await apiClient.post<{ data: AuthUser; token: string }>(
      '/api/auth/register',
      { name, email, password }
    );
    return res.data;
  },

  async login(
    email: string,
    password: string
  ): Promise<{ data: AuthUser; token: string }> {
    const res = await apiClient.post<{ data: AuthUser; token: string }>(
      '/api/auth/login',
      { email, password }
    );
    return res.data;
  },
};
