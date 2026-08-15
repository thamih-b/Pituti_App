// src/api/types.ts
// Tipos de DTOs para requests à API

// ── Shared Literal Types ──────────────────────────────────────────────────────

export type Species =
  | 'cat'
  | 'dog'
  | 'bird'
  | 'rabbit'
  | 'reptile'
  | 'fish'
  | 'other'

export type PetSex = 'male' | 'female' | 'unknown'

export type EnvironmentType = 'apartment' | 'house' | 'both'

export type SymptomSeverity = 'mild' | 'moderate' | 'severe'

export type CarePeriodType = 'day' | 'week' | 'month'

export type CareStatus = 'pending' | 'done' | 'skipped'

export type NoteType =
  | 'control'
  | 'observacao'
  | 'emergencia'
  | 'vacuna'
  | 'cirugia'
  | 'otro'

export type VetType = 'primary' | 'specialist' | 'emergency' | 'other'

export type AppointmentType =
  | 'routine'
  | 'emergency'
  | 'specialist'
  | 'followup'
  | 'exam'
  | 'vaccine'
  | 'other'

// ── Auth DTOs ─────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  data: {
    user: AuthUser
    token: string
  }
}

// ── Pets DTOs ─────────────────────────────────────────────────────────────────

export interface CreatePetDto {
  name: string
  species: Species
  breed?: string
  birthDate?: string
  photoUrl?: string | null
  color?: string | null
  microchip?: string | null
  passport?: string | null
  ownerId?: string
}

export interface UpdatePetDto {
  name?: string
  species?: Species
  breed?: string
  birthDate?: string
  photoUrl?: string | null
  color?: string | null
  microchip?: string | null
  passport?: string | null
}

// ── Medical Profile DTOs ──────────────────────────────────────────────────────

export interface UpsertMedicalProfileDto {
  sex?: PetSex
  neutered?: boolean | null
  neuteredAge?: string | null
  bloodType?: string | null
  allergies?: string[]
  conditions?: Array<{
    name: string
    notes?: string
  }>
  surgeries?: Array<{
    name: string
    notes?: string
  }>
  environment?: EnvironmentType | null
  livingWithAnimals?: boolean | null
  behavioralNotes?: string | null
  vetQuestions?: string | null
  weightKg?: number | null
}

// ── Vaccines DTOs ─────────────────────────────────────────────────────────────

export interface CreateVaccineDto {
  name: string
  date: string
  nextDueDate?: string | null
  veterinary?: string | null
  notes?: string | null
}

export interface UpdateVaccineDto {
  name?: string
  date?: string
  nextDueDate?: string | null
  veterinary?: string | null
  notes?: string | null
}

// ── Medications DTOs ──────────────────────────────────────────────────────────

export interface CreateMedicationDto {
  name: string
  dosage: string
  frequency: string
  startDate?: string | null
  endDate?: string | null
  notes?: string | null
}

export interface UpdateMedicationDto {
  name?: string
  dosage?: string
  frequency?: string
  startDate?: string | null
  endDate?: string | null
  notes?: string | null
}

// ── Symptoms DTOs ─────────────────────────────────────────────────────────────

export interface CreateSymptomDto {
  description: string
  severity: SymptomSeverity
  date: string
  notes?: string | null
  resolved?: boolean
}

export interface UpdateSymptomDto {
  description?: string
  severity?: SymptomSeverity
  date?: string
  notes?: string | null
  resolved?: boolean
}

// ── Cares DTOs ────────────────────────────────────────────────────────────────

export interface CreateCareDto {
  name: string
  type: string
  frequency?: number | null
  periodType?: CarePeriodType | null
  // FIX (sync): intervalo customizado ("a cada X dias")
  intervalDays?: number | null
  time?: string | null
  notes?: string | null
  status?: CareStatus
}

export interface UpdateCareDto {
  name?: string
  type?: string
  frequency?: number | null
  periodType?: CarePeriodType | null
  intervalDays?: number | null
  time?: string | null
  notes?: string | null
  status?: CareStatus
  // FIX (sync): estado diário de conclusão, persistido no servidor
  doneDates?: Record<string, { done: number; doneState: boolean }>
}

// ── Notes DTOs ────────────────────────────────────────────────────────────────

export interface CreateNoteDto {
  content: string
  veterinary?: string | null
  type?: NoteType
  // FIX: toApiCreateNoteDto/mapApiNote sempre usaram 'date' e 'vet' —
  // os tipos nunca tinham sido atualizados para os incluir (isto nunca foi
  // apanhado porque o build de produção usa só `vite build`, sem tsc).
  date?: string | null
  vet?: string | null
}

export interface UpdateNoteDto {
  content?: string
  veterinary?: string | null
  type?: NoteType
  date?: string | null
  vet?: string | null
}

// ── Vets DTOs ─────────────────────────────────────────────────────────────────

export interface CreateVetDto {
  name: string
  clinic: string
  phone: string
  type?: VetType
  specialty?: string | null
  phone2?: string | null
  address?: string | null
  notes?: string | null
  petIds?: string[]
}

export interface UpdateVetDto {
  name?: string
  clinic?: string
  phone?: string
  type?: VetType
  specialty?: string | null
  phone2?: string | null
  address?: string | null
  notes?: string | null
  petIds?: string[]
}

// ── Appointments DTOs ─────────────────────────────────────────────────────────

export interface CreateAppointmentDto {
  petId: string
  type?: AppointmentType
  date: string
  vetContactId?: string | null
  vetName: string
  clinic?: string | null
  reason: string
  diagnosis?: string | null
  treatment?: string | null
  nextAppointmentDate?: string | null
  nextAppointmentNote?: string | null
  weightKg?: number | null
  cost?: number | null
  notes?: string | null
}

export interface UpdateAppointmentDto {
  petId?: string
  type?: AppointmentType
  date?: string
  vetContactId?: string | null
  vetName?: string
  clinic?: string | null
  reason?: string
  diagnosis?: string | null
  treatment?: string | null
  nextAppointmentDate?: string | null
  nextAppointmentNote?: string | null
  weightKg?: number | null
  cost?: number | null
  notes?: string | null
}

// ── API Response Types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
}

export interface ApiError {
  error: string
  message?: string
  status?: number
}

// ── API Entity Types ──────────────────────────────────────────────────────────

export interface ApiPet {
  id: string
  name: string
  species: Species
  breed?: string | null
  birthDate?: string | null
  photoUrl?: string | null
  color?: string | null
  microchip?: string | null
  passport?: string | null
  ownerId: string
  createdAt: string
}

export interface ApiMedicalProfile {
  petId: string
  sex?: PetSex
  neutered?: boolean | null
  neuteredAge?: string | null
  bloodType?: string | null
  allergies?: string[]
  conditions?: Array<{
    name: string
    notes?: string
  }>
  surgeries?: Array<{
    name: string
    notes?: string
  }>
  environment?: EnvironmentType | null
  livingWithAnimals?: boolean | null
  behavioralNotes?: string | null
  vetQuestions?: string | null
  weightKg?: number | null
  updatedAt?: string | null
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
  severity: SymptomSeverity
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
  periodType?: CarePeriodType | null
  intervalDays?: number | null
  time?: string | null
  notes?: string | null
  status?: CareStatus
  doneDates?: Record<string, { done: number; doneState: boolean }>
  createdAt: string
}

export interface ApiNote {
  id: string
  petId: string
  content: string
  veterinary?: string | null
  type?: NoteType
  date?: string | null
  vet?: string | null
  createdAt: string
}

export interface ApiVet {
  id: string
  ownerId?: string
  name: string
  clinic: string
  phone: string
  type?: VetType
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
  date: string
  type: AppointmentType
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

export interface CreateUserDto {
  name: string
  email: string
  photoUrl?: string | null
  phone?: string | null
  city?: string | null
  bio?: string | null
}

export interface UpdateUserDto {
  name?: string
  email?: string
  photoUrl?: string | null
  phone?: string | null
  city?: string | null
  bio?: string | null
}

export interface ApiUser {
  id: string
  name: string
  email: string
  photoUrl?: string | null
  phone?: string | null
  city?: string | null
  bio?: string | null
  createdAt: string
}