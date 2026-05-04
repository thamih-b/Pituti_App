import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  res  => res,
  err  => {
    const msg = err.response?.data?.error ?? err.message ?? 'Error de red'
    return Promise.reject(new Error(msg))
  }
)
