/**
 * Pituti API Client
 * Camada de rede centralizada com autenticação JWT
 */

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// ── Tipos de resposta da API ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
}

export interface ApiError {
  status: number
  message: string
}

// ── Tipos de domínio alinhados com o backend ──────────────────────────────────

export type ApiSpecies = 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'

export interface ApiPet {
  id: string
  name: string
  species: ApiSpecies
  breed?: string | null
  birthDate?: string | null
  photoUrl?: string | null
  ownerId: string
  createdAt: string
}

export interface CreatePetDto {
  name: string
  species: ApiSpecies
  breed?: string
  birthDate?: string
  photoUrl?: string | null
  ownerId?: string
}

export interface UpdatePetDto {
  name?: string
  species?: ApiSpecies
  breed?: string
  birthDate?: string
  photoUrl?: string | null
}

export interface ApiVet {
  id: string
  ownerId?: string
  name: string
  clinic: string
  phone: string
  type?: 'primary' | 'specialist' | 'emergency' | 'other'
  specialty?: string | null
  phone2?: string | null
  address?: string | null
  notes?: string | null
  createdAt: string
}

export interface ApiAppointment {
  id: string
  petId: string
  vetId?: string
  vetName: string
  clinic?: string | null
  type: string
  date: string
  reason: string
  diagnosis?: string | null
  treatment?: string | null
  nextAppointmentDate?: string | null
  nextAppointmentNote?: string | null
  weightKg?: number | null
  cost?: number | null
  notes?: string | null
  createdAt: string
}

export interface ApiMedication {
  id: string
  petId: string
  name: string
  dosage: string
  frequency: string
  startDate?: string | null
  endDate?: string | null
  notes?: string | null
  createdAt: string
}

export interface ApiSymptom {
  id: string
  petId: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  notes?: string | null
  resolved: boolean
  createdAt: string
}

export interface ApiCare {
  id: string
  petId: string
  name: string
  type: string
  frequency?: number | null
  periodType?: 'day' | 'week' | 'month' | null
  time?: string | null
  notes?: string | null
  status?: 'pending' | 'done' | 'skipped'
  createdAt: string
}

export interface ApiVaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDueDate?: string | null
  veterinary?: string | null
  notes?: string | null
  createdAt: string
}

export interface ApiNote {
  id: string
  petId: string
  content: string
  veterinary?: string | null
  type?: 'control' | 'observacion' | 'emergencia' | 'vacuna' | 'cirugia' | 'otro'
  createdAt: string
}

export interface ApiMedicalProfile {
  petId: string
  sex?: 'male' | 'female' | 'unknown'
  neutered?: boolean | null
  neuteredAge?: string | null
  bloodType?: string | null
  allergies?: string[]
  conditions?: Array<{ name: string; notes?: string }>
  surgeries?: Array<{ name: string; notes?: string }>
  environment?: 'apartment' | 'house' | 'both' | null
  livingWithAnimals?: boolean | null
  behavioralNotes?: string | null
  vetQuestions?: string | null
  updatedAt?: string | null
}

// ── Gestão de Token ───────────────────────────────────────────────────────────

// CORRIGIDO: chave consistente em todas as funções
const TOKEN_KEY = 'pituti_token'
const USER_KEY = 'pituti_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string, remember: boolean = true): void {
  clearToken()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)
}

// ── Cliente HTTP ──────────────────────────────────────────────────────────────

class ApiClient {
  private base: string

  constructor(base: string) {
    this.base = base
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const token = getToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${this.base}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

if (res.status === 401) {
  clearToken()
  const errBody = await res.json().catch(() => ({}))
  const message = errBody?.error ?? errBody?.message ?? 'Credenciais inválidas'
  // só redireciona se NÃO estiver já numa página de auth
  const onAuthPage = typeof window !== 'undefined' &&
    (window.location.pathname === '/login' || window.location.pathname === '/register')
  if (!onAuthPage) {
    window.location.href = '/login'
  }
  throw new Error(message)
}

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err?.error ?? err?.message ?? `HTTP ${res.status}`)
    }

    if (res.status === 204) {
      return { data: undefined as unknown as T }
    }

    return res.json()
  }

  get<T>(path: string) {
    return this.request<T>('GET', path)
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>('POST', path, body)
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>('PATCH', path, body)
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>('PUT', path, body)
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path)
  }
}

export const api = new ApiClient(BASE_URL)
