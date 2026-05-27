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

export function getToken(): string | null {
  return localStorage.getItem('pitutitoken') || sessionStorage.getItem('pitutitoken')
}


export function setToken(token: string, remember: boolean = true): void {
  clearToken()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('pituti_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('pituti_token')
  sessionStorage.removeItem('pituti_token')
  localStorage.removeItem('pituti_user')
  sessionStorage.removeItem('pituti_user')
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
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      throw new Error('Sessão expirada. Por favor, faça login novamente.')
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

// ── Recursos ──────────────────────────────────────────────────────────────────

export const petsApi = {
  getAll: (ownerId?: string) =>
    api.get<ApiPet[]>(ownerId ? `/pets?ownerId=${encodeURIComponent(ownerId)}` : '/pets'),

  getById: (id: string) =>
    api.get<ApiPet>(`/pets/${id}`),

  create: (dto: CreatePetDto) =>
    api.post<ApiPet>('/pets', dto),

  update: (id: string, dto: UpdatePetDto) =>
    api.patch<ApiPet>(`/pets/${id}`, dto),

  delete: (id: string) =>
    api.delete<void>(`/pets/${id}`),
}

export const vetsApi = {
  getAll: () => api.get<ApiVet[]>('/vets'),
  getById: (id: string) => api.get<ApiVet>(`/vets/${id}`),
  create: (dto: Partial<ApiVet>) => api.post<ApiVet>('/vets', dto),
  update: (id: string, dto: Partial<ApiVet>) => api.patch<ApiVet>(`/vets/${id}`, dto),
  delete: (id: string) => api.delete<void>(`/vets/${id}`),
}

export const appointmentsApi = {
  getAll: (vetId: string) => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`),
  create: (vetId: string, dto: Partial<ApiAppointment>) =>
    api.post<ApiAppointment>(`/vets/${vetId}/appointments`, dto),
  update: (vetId: string, id: string, dto: Partial<ApiAppointment>) =>
    api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, dto),
  delete: (vetId: string, id: string) =>
    api.delete<void>(`/vets/${vetId}/appointments/${id}`),
}

export const medicationsApi = {
  getAll: (petId: string) => api.get<ApiMedication[]>(`/pets/${petId}/medications`),
  create: (petId: string, dto: Partial<ApiMedication>) =>
    api.post<ApiMedication>(`/pets/${petId}/medications`, dto),
  update: (petId: string, id: string, dto: Partial<ApiMedication>) =>
    api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, dto),
  delete: (petId: string, id: string) =>
    api.delete<void>(`/pets/${petId}/medications/${id}`),
}

export const symptomsApi = {
  getAll: (petId: string) => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`),
  create: (petId: string, dto: Partial<ApiSymptom>) =>
    api.post<ApiSymptom>(`/pets/${petId}/symptoms`, dto),
  update: (petId: string, id: string, dto: Partial<ApiSymptom>) =>
    api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, dto),
  delete: (petId: string, id: string) =>
    api.delete<void>(`/pets/${petId}/symptoms/${id}`),
}

export const caresApi = {
  getAll: (petId: string) => api.get<ApiCare[]>(`/pets/${petId}/cares`),
  create: (petId: string, dto: Partial<ApiCare>) =>
    api.post<ApiCare>(`/pets/${petId}/cares`, dto),
  update: (petId: string, id: string, dto: Partial<ApiCare>) =>
    api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, dto),
  delete: (petId: string, id: string) =>
    api.delete<void>(`/pets/${petId}/cares/${id}`),
}

export const vaccinesApi = {
  getAll: (petId: string) => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`),
  create: (petId: string, dto: Partial<ApiVaccine>) =>
    api.post<ApiVaccine>(`/pets/${petId}/vaccines`, dto),
  update: (petId: string, id: string, dto: Partial<ApiVaccine>) =>
    api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, dto),
  delete: (petId: string, id: string) =>
    api.delete<void>(`/pets/${petId}/vaccines/${id}`),
}

export const notesApi = {
  getAll: (petId: string) => api.get<ApiNote[]>(`/pets/${petId}/notes`),
  create: (petId: string, dto: Partial<ApiNote>) =>
    api.post<ApiNote>(`/pets/${petId}/notes`, dto),
  update: (petId: string, id: string, dto: Partial<ApiNote>) =>
    api.patch<ApiNote>(`/pets/${petId}/notes/${id}`, dto),
  delete: (petId: string, id: string) =>
    api.delete<void>(`/pets/${petId}/notes/${id}`),
}

export const medicalProfilesApi = {
  get: (petId: string) => api.get<ApiMedicalProfile>(`/pets/${petId}/medical-profile`),
  upsert: (petId: string, dto: Partial<ApiMedicalProfile>) =>
    api.put<ApiMedicalProfile>(`/pets/${petId}/medical-profile`, dto),
}