// src/api/types.ts
// Tipos de DTOs para requests à API

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

export interface AuthResponse {
  data: {
    user: {
      id: string
      name: string
      email: string
    }
    token: string
  }
}

// ── Pets DTOs ─────────────────────────────────────────────────────────────────

export interface CreatePetDto {
  name: string
  species: 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'
  breed?: string
  birth_date?: string
  photo_url?: string
  color?: string
  microchip?: string
  passport?: string
}

export interface UpdatePetDto {
  name?: string
  species?: 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'
  breed?: string
  birth_date?: string
  photo_url?: string
  color?: string
  microchip?: string
  passport?: string
}

// ── Medical Profile DTOs ──────────────────────────────────────────────────────

export interface UpsertMedicalProfileDto {
  weight_kg?: number
  blood_type?: string
  allergies?: string
  chronic_conditions?: string
  special_diet?: string
  veterinarian_name?: string
  veterinarian_phone?: string
  veterinarian_clinic?: string
  insurance_number?: string
  insurance_provider?: string
  notes?: string
}

// ── Vaccines DTOs ─────────────────────────────────────────────────────────────

export interface CreateVaccineDto {
  name: string
  vaccine_date: string
  next_dose_date?: string
  batch_number?: string
  veterinarian?: string
  clinic?: string
  notes?: string
}

export interface UpdateVaccineDto {
  name?: string
  vaccine_date?: string
  next_dose_date?: string
  batch_number?: string
  veterinarian?: string
  clinic?: string
  notes?: string
}

// ── Medications DTOs ──────────────────────────────────────────────────────────

export interface CreateMedicationDto {
  name: string
  dosage: string
  frequency: string
  start_date?: string
  end_date?: string
  prescribed_by?: string
  reason?: string
  notes?: string
}

export interface UpdateMedicationDto {
  name?: string
  dosage?: string
  frequency?: string
  start_date?: string
  end_date?: string
  prescribed_by?: string
  reason?: string
  notes?: string
}

// ── Symptoms DTOs ─────────────────────────────────────────────────────────────

export interface CreateSymptomDto {
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  description?: string
  observed_date: string
  resolved?: boolean
  resolved_date?: string
}

export interface UpdateSymptomDto {
  symptom?: string
  severity?: 'mild' | 'moderate' | 'severe'
  description?: string
  observed_date?: string
  resolved?: boolean
  resolved_date?: string
}

// ── Cares DTOs ────────────────────────────────────────────────────────────────

export interface CreateCareDto {
  name: string
  type: string
  frequency?: string
  period_type?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  last_done?: string
  next_due?: string
  notes?: string
}

export interface UpdateCareDto {
  name?: string
  type?: string
  frequency?: string
  period_type?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  last_done?: string
  next_due?: string
  notes?: string
}

// ── Notes DTOs ────────────────────────────────────────────────────────────────

export interface CreateNoteDto {
  title?: string
  content: string
  note_date?: string
}

export interface UpdateNoteDto {
  title?: string
  content?: string
  note_date?: string
}

// ── Vets DTOs ─────────────────────────────────────────────────────────────────

export interface CreateVetDto {
  name: string
  clinic?: string
  phone?: string
  email?: string
  address?: string
  specialization?: string
  notes?: string
}

export interface UpdateVetDto {
  name?: string
  clinic?: string
  phone?: string
  email?: string
  address?: string
  specialization?: string
  notes?: string
}

// ── Appointments DTOs ─────────────────────────────────────────────────────────

export interface CreateAppointmentDto {
  pet_id: string
  vet_name: string
  clinic?: string
  date: string
  type?: string
  reason?: string
  diagnosis?: string
  treatment?: string
  next_appointment_date?: string
  next_appointment_note?: string
  weight_kg?: number
  cost?: number
  notes?: string
}

export interface UpdateAppointmentDto {
  pet_id?: string
  vet_name?: string
  clinic?: string
  date?: string
  type?: string
  reason?: string
  diagnosis?: string
  treatment?: string
  next_appointment_date?: string
  next_appointment_note?: string
  weight_kg?: number
  cost?: number
  notes?: string
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

export interface ApiPet {
  id: string
  name: string
  species: 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'
  breed?: string
  birth_date?: string
  photo_url?: string
  color?: string
  microchip?: string
  passport?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface ApiMedicalProfile {
  id: string
  pet_id: string
  weight_kg?: number
  blood_type?: string
  allergies?: string
  chronic_conditions?: string
  special_diet?: string
  veterinarian_name?: string
  veterinarian_phone?: string
  veterinarian_clinic?: string
  insurance_number?: string
  insurance_provider?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiVaccine {
  id: string
  pet_id: string
  name: string
  vaccine_date: string
  next_dose_date?: string
  batch_number?: string
  veterinarian?: string
  clinic?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiMedication {
  id: string
  pet_id: string
  name: string
  dosage: string
  frequency: string
  start_date?: string
  end_date?: string
  prescribed_by?: string
  reason?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiSymptom {
  id: string
  pet_id: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  description?: string
  observed_date: string
  resolved: boolean
  resolved_date?: string
  created_at: string
  updated_at: string
}

export interface ApiCare {
  id: string
  pet_id: string
  name: string
  type: string
  frequency?: string
  period_type?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  last_done?: string
  next_due?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiNote {
  id: string
  pet_id: string
  title?: string
  content: string
  note_date: string
  created_at: string
  updated_at: string
}

export interface ApiVet {
  id: string
  name: string
  clinic?: string
  phone?: string
  email?: string
  address?: string
  specialization?: string
  notes?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface ApiAppointment {
  id: string
  pet_id: string
  vet_id: string
  vet_name: string
  clinic?: string
  date: string
  type?: string
  reason?: string
  diagnosis?: string
  treatment?: string
  next_appointment_date?: string
  next_appointment_note?: string
  weight_kg?: number
  cost?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiUser {
  id: string
  name: string
  email: string
  photo_url?: string
  created_at: string
  updated_at: string
}
