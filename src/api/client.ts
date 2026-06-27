import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function getToken(): string | null {
  return (
    localStorage.getItem('pitutitoken') ??
    sessionStorage.getItem('pitutitoken') ??
    null
  );
}

export function setToken(token: string, rememberMe = true): void {
  if (rememberMe) {
    localStorage.setItem('pitutitoken', token);
    sessionStorage.removeItem('pitutitoken');
  } else {
    sessionStorage.setItem('pitutitoken', token);
    localStorage.removeItem('pitutitoken');
  }
}

export function removeToken(): void {
  localStorage.removeItem('pitutitoken');
  sessionStorage.removeItem('pitutitoken');
  localStorage.removeItem('pitutiuser');
  sessionStorage.removeItem('pitutiuser');
}

// Injeta Authorization em TODAS as chamadas automaticamente
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redireciona para login em 401
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      removeToken();
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);
