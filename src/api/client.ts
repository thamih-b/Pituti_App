// Pituti API Client
export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface ApiResponse<T> { data: T; total?: number; page?: number; }
export interface ApiError { status: number; message: string; }

const TOKEN_KEY = 'pitutitoken';
const USER_KEY  = 'pitutiuser';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? null;
}

export function setToken(token: string, remember = true): void {
  const primary   = remember ? localStorage : sessionStorage;
  const secondary = remember ? sessionStorage : localStorage;
  primary.setItem(TOKEN_KEY, token);
  secondary.removeItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

class ApiClient {
  private base: string;
  constructor(base: string) { this.base = base; }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const token = getToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${this.base}${path}`, {
      method, headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      clearToken();
      const errBody = await res.json().catch(() => ({}));
      const message = errBody?.error ?? errBody?.message ?? 'Credenciais invalidas';
      const onAuthPage = typeof window !== 'undefined' &&
        (window.location.pathname.includes('login') || window.location.pathname.includes('register'));
      if (!onAuthPage) window.location.href = '/login';
      throw new Error(message);
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error ?? err?.message ?? `HTTP ${res.status}`);
    }
    if (res.status === 204) return { data: undefined as unknown as T };
    return res.json();
  }

  get<T>(path: string)                  { return this.request<T>('GET',    path);       }
  post<T>(path: string, body: unknown)  { return this.request<T>('POST',   path, body); }
  patch<T>(path: string, body: unknown) { return this.request<T>('PATCH',  path, body); }
  put<T>(path: string, body: unknown)   { return this.request<T>('PUT',    path, body); }
  delete<T>(path: string)               { return this.request<T>('DELETE', path);       }
}

export const api = new ApiClient(BASE_URL);
