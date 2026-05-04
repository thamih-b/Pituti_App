/**
 * Pituti API Client
 * Camada de rede centralizada — todos os fetches passam por aqui.
 */

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

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

// ── Tipos de domínio ──────────────────────────────────────────────────────────

export interface ApiPet {
  id:        string
  name:      string
  species:   'cat' | 'dog' | 'bird' | 'other'
  breed?:    string
  birthDate?:string
  photoUrl?: string
  ownerId:   string
  createdAt: string
}

export interface ApiVet {
  id:         string
  name:       string
  clinic:     string
  type:       'primary' | 'specialist' | 'emergency' | 'other'
  specialty?: string
  phone:      string
  phone2?:    string
  address?:   string
  notes?:     string
  petIds:     string[]
  createdAt:  string
}

export interface ApiAppointment {
  id:                   string
  petId:                string
  vetContactId?:        string
  vetName:              string
  clinic?:              string
  date:                 string
  time?:                string
  type:                 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other'
  reason:               string
  diagnosis?:           string
  treatment?:           string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?:            number
  notes?:               string
  createdAt:            string
}

export interface ApiMedication {
  id:        string
  petId:     string
  name:      string
  dosage:    string
  frequency: string
  startDate?:string
  endDate?:  string | null
  notes?:    string
  createdAt: string
}

export interface ApiSymptom {
  id:          string
  petId:       string
  description: string
  severity:    'mild' | 'moderate' | 'severe'
  date:        string
  notes?:      string
  resolved:    boolean
  createdAt:   string
}

export interface ApiCare {
  id:         string
  petId:      string
  name:       string
  type:       'food' | 'water' | 'walk' | 'bath' | 'brush' | 'medication' | 'other'
  frequency:  number
  periodType: 'day' | 'week' | 'month'
  time?:      string
  notes?:     string
  status:     'pending' | 'done'
  createdAt:  string
}

export interface ApiVaccine {
  id:           string
  petId:        string
  name:         string
  date:         string
  nextDueDate?: string
  veterinary?:  string
  notes?:       string
  createdAt:    string
}

// ── Cliente HTTP ──────────────────────────────────────────────────────────────

class ApiClient {
  private base: string

  constructor(base: string) {
    this.base = base
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.base}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err?.error ?? `HTTP ${res.status}`)
    }
    if (res.status === 204) return { data: undefined as unknown as T }
    return res.json()
  }

  get<T>(path: string)                        { return this.request<T>('GET',    path) }
  post<T>(path: string, body: unknown)        { return this.request<T>('POST',   path, body) }
  patch<T>(path: string, body: unknown)       { return this.request<T>('PATCH',  path, body) }
  put<T>(path: string, body: unknown)         { return this.request<T>('PUT',    path, body) }
  delete<T>(path: string)                     { return this.request<T>('DELETE', path) }
}

export const api = new ApiClient(BASE_URL)

// Named re-exports para os módulos de recursos
export const petsApi        = { getAll: () => api.get<ApiPet[]>('/pets'), getById: (id: string) => api.get<ApiPet>(`/pets/${id}`), create: (dto: Partial<ApiPet>) => api.post<ApiPet>('/pets', dto), update: (id: string, dto: Partial<ApiPet>) => api.patch<ApiPet>(`/pets/${id}`, dto), delete: (id: string) => api.delete<void>(`/pets/${id}`) }
export const vetsApi        = { getAll: () => api.get<ApiVet[]>('/vets'), getById: (id: string) => api.get<ApiVet>(`/vets/${id}`), create: (dto: Partial<ApiVet>) => api.post<ApiVet>('/vets', dto), update: (id: string, dto: Partial<ApiVet>) => api.patch<ApiVet>(`/vets/${id}`, dto), delete: (id: string) => api.delete<void>(`/vets/${id}`) }
export const appointmentsApi = { getAll: (vetId: string) => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`), create: (vetId: string, dto: Partial<ApiAppointment>) => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, dto), update: (vetId: string, id: string, dto: Partial<ApiAppointment>) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, dto), delete: (vetId: string, id: string) => api.delete<void>(`/vets/${vetId}/appointments/${id}`) }
export const medicationsApi = { getAll: (petId: string) => api.get<ApiMedication[]>(`/pets/${petId}/medications`), create: (petId: string, dto: Partial<ApiMedication>) => api.post<ApiMedication>(`/pets/${petId}/medications`, dto), update: (petId: string, id: string, dto: Partial<ApiMedication>) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/medications/${id}`) }
export const symptomsApi    = { getAll: (petId: string) => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`), create: (petId: string, dto: Partial<ApiSymptom>) => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, dto), update: (petId: string, id: string, dto: Partial<ApiSymptom>) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/symptoms/${id}`) }
export const caresApi       = { getAll: (petId: string) => api.get<ApiCare[]>(`/pets/${petId}/cares`), create: (petId: string, dto: Partial<ApiCare>) => api.post<ApiCare>(`/pets/${petId}/cares`, dto), update: (petId: string, id: string, dto: Partial<ApiCare>) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/cares/${id}`) }
export const vaccinesApi    = { getAll: (petId: string) => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`), create: (petId: string, dto: Partial<ApiVaccine>) => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, dto), update: (petId: string, id: string, dto: Partial<ApiVaccine>) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, dto), delete: (petId: string, id: string) => api.delete<void>(`/pets/${petId}/vaccines/${id}`) }
