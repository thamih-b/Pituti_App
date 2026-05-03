/**
 * Pituti API Client
 * Camada de rede centralizada — todos os fetches passam por aqui.
 * Substitui chamadas fetch() diretas nos contexts.
 */

export const BASE_URL = 'http://localhost:3001/api'

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

// ── Tipos de domínio (alinhados com server/data/store.js) ─────────────────────

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

  private async request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.base}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }))
      throw { status: res.status, message: err.message ?? 'Unknown error' } satisfies ApiError
    }
    return res.json()
  }

  get<T>(path: string)                  { return this.request<T>(path) }
  post<T>(path: string, body: unknown)  { return this.request<T>(path, { method: 'POST',   body: JSON.stringify(body) }) }
  put<T>(path: string, body: unknown)   { return this.request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }) }
  patch<T>(path: string, body: unknown) { return this.request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }) }
  delete<T>(path: string)               { return this.request<T>(path, { method: 'DELETE' }) }
}

export const api = new ApiClient(BASE_URL)

// ── Recursos tipados ──────────────────────────────────────────────────────────

export const petsApi = {
  getAll:  ()                        => api.get<ApiPet[]>('/pets'),
  getById: (id: string)              => api.get<ApiPet>(`/pets/${id}`),
  create:  (body: Partial<ApiPet>)   => api.post<ApiPet>('/pets', body),
  update:  (id: string, body: Partial<ApiPet>) => api.patch<ApiPet>(`/pets/${id}`, body),
  delete:  (id: string)              => api.delete<void>(`/pets/${id}`),
}

export const vetsApi = {
  getAll:  ()                        => api.get<ApiVet[]>('/vets'),
  getById: (id: string)              => api.get<ApiVet>(`/vets/${id}`),
  create:  (body: Partial<ApiVet>)   => api.post<ApiVet>('/vets', body),
  update:  (id: string, body: Partial<ApiVet>) => api.patch<ApiVet>(`/vets/${id}`, body),
  delete:  (id: string)              => api.delete<void>(`/vets/${id}`),
}

export const appointmentsApi = {
  getAll:  (vetId: string)                           => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`),
  create:  (vetId: string, body: Partial<ApiAppointment>) => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, body),
  update:  (vetId: string, id: string, body: Partial<ApiAppointment>) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, body),
  delete:  (vetId: string, id: string)               => api.delete<void>(`/vets/${vetId}/appointments/${id}`),
}

export const medicationsApi = {
  getAll:  (petId: string)                              => api.get<ApiMedication[]>(`/pets/${petId}/medications`),
  create:  (petId: string, body: Partial<ApiMedication>) => api.post<ApiMedication>(`/pets/${petId}/medications`, body),
  update:  (petId: string, id: string, body: Partial<ApiMedication>) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, body),
  delete:  (petId: string, id: string)                  => api.delete<void>(`/pets/${petId}/medications/${id}`),
}

export const symptomsApi = {
  getAll:  (petId: string)                           => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`),
  create:  (petId: string, body: Partial<ApiSymptom>) => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, body),
  update:  (petId: string, id: string, body: Partial<ApiSymptom>) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, body),
  delete:  (petId: string, id: string)               => api.delete<void>(`/pets/${petId}/symptoms/${id}`),
}

export const caresApi = {
  getAll:  (petId: string)                        => api.get<ApiCare[]>(`/pets/${petId}/cares`),
  create:  (petId: string, body: Partial<ApiCare>) => api.post<ApiCare>(`/pets/${petId}/cares`, body),
  update:  (petId: string, id: string, body: Partial<ApiCare>) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, body),
  delete:  (petId: string, id: string)            => api.delete<void>(`/pets/${petId}/cares/${id}`),
}

export const vaccinesApi = {
  getAll:  (petId: string)                           => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`),
  create:  (petId: string, body: Partial<ApiVaccine>) => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, body),
  update:  (petId: string, id: string, body: Partial<ApiVaccine>) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, body),
  delete:  (petId: string, id: string)               => api.delete<void>(`/pets/${petId}/vaccines/${id}`),
}
