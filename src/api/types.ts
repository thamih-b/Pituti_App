/**
 * API contract types — aligned with backend validators and store shapes.
 * These are the "wire types" returned by the API (all ids are strings, dates are strings).
 * Import these in api modules and cast to domain types when needed.
 */

// ── Users ─────────────────────────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  createdAt: string;
}
export type CreateUserDto  = Omit<ApiUser, 'id' | 'createdAt'>;
export type UpdateUserDto  = Partial<CreateUserDto>;

// ── Pets ──────────────────────────────────────────────────────────────────────
export type ApiSpecies = 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other';
export interface ApiPet {
  id: string;
  name: string;
  species: ApiSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl: string | null;
  ownerId: string;
  createdAt: string;
}
export type CreatePetDto = Omit<ApiPet, 'id' | 'createdAt'>;
export type UpdatePetDto = Partial<Omit<CreatePetDto, 'ownerId'>>;

// ── Vaccines ──────────────────────────────────────────────────────────────────
export interface ApiVaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDueDate?: string | null;
  veterinary?: string | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateVaccineDto = Omit<ApiVaccine, 'id' | 'petId' | 'createdAt'>;
export type UpdateVaccineDto = Partial<CreateVaccineDto>;

// ── Medications ───────────────────────────────────────────────────────────────
export interface ApiMedication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateMedicationDto = Omit<ApiMedication, 'id' | 'petId' | 'createdAt'>;
export type UpdateMedicationDto = Partial<CreateMedicationDto>;

// ── Symptoms ──────────────────────────────────────────────────────────────────
export type ApiSeverity = 'mild' | 'moderate' | 'severe';
export interface ApiSymptom {
  id: string;
  petId: string;
  description: string;
  severity: ApiSeverity;
  date: string;
  notes?: string | null;
  resolved: boolean;
  createdAt: string;
}
export type CreateSymptomDto = Omit<ApiSymptom, 'id' | 'petId' | 'createdAt'>;
export type UpdateSymptomDto = Partial<CreateSymptomDto>;

// ── Cares ─────────────────────────────────────────────────────────────────────
export type ApiPeriodType = 'day' | 'week' | 'month';
export type ApiCareStatus = 'pending' | 'done' | 'skipped';
export interface ApiCare {
  id: string;
  petId: string;
  name: string;
  type: string;
  frequency?: number;
  periodType?: ApiPeriodType;
  time?: string | null;
  notes?: string | null;
  status: ApiCareStatus;
  createdAt: string;
}
export type CreateCareDto = Omit<ApiCare, 'id' | 'petId' | 'createdAt'>;
export type UpdateCareDto = Partial<CreateCareDto>;

// ── Notes ─────────────────────────────────────────────────────────────────────
export type ApiNoteType = 'control' | 'observacion' | 'emergencia' | 'vacuna' | 'cirugia' | 'otro';
export interface ApiNote {
  id: string;
  petId: string;
  content: string;
  veterinary?: string | null;
  type: ApiNoteType;
  createdAt: string;
}
export type CreateNoteDto = Omit<ApiNote, 'id' | 'petId' | 'createdAt'>;
export type UpdateNoteDto = Partial<CreateNoteDto>;

// ── Medical Profile ───────────────────────────────────────────────────────────
export interface ApiCondition { name: string; notes?: string; }
export interface ApiSurgery   { name: string; notes?: string; }
export interface ApiMedicalProfile {
  petId: string;
  sex?: 'male' | 'female' | 'unknown';
  neutered?: boolean | null;
  neuteredAge?: string | null;
  bloodType?: string | null;
  allergies: string[];
  conditions: ApiCondition[];
  surgeries: ApiSurgery[];
  environment?: 'apartment' | 'house' | 'both' | null;
  livingWithAnimals?: boolean | null;
  behavioralNotes?: string | null;
  vetQuestions?: string | null;
  updatedAt: string | null;
}
export type UpsertMedicalProfileDto = Omit<ApiMedicalProfile, 'petId' | 'updatedAt'>;

// ── Vets ──────────────────────────────────────────────────────────────────────
export type ApiVetType = 'primary' | 'specialist' | 'emergency' | 'other';
export interface ApiVet {
  id: string;
  name: string;
  clinic: string;
  type: ApiVetType;
  specialty?: string | null;
  phone: string;
  phone2?: string | null;
  address?: string | null;
  notes?: string | null;
  petIds: string[];
  createdAt: string;
}
export type CreateVetDto = Omit<ApiVet, 'id' | 'createdAt'>;
export type UpdateVetDto = Partial<CreateVetDto>;

// ── Appointments ──────────────────────────────────────────────────────────────
export type ApiAppointmentType = 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other';
export interface ApiAppointment {
  id: string;
  petId: string;
  vetContactId?: string | null;
  vetName: string;
  clinic?: string | null;
  type: ApiAppointmentType;
  date: string;
  reason: string;
  diagnosis?: string | null;
  treatment?: string | null;
  nextAppointmentDate?: string | null;
  nextAppointmentNote?: string | null;
  weightKg?: number | null;
  cost?: number | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateAppointmentDto = Omit<ApiAppointment, 'id' | 'vetContactId' | 'createdAt'>;
export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;

// ── Health ────────────────────────────────────────────────────────────────────
export interface ApiHealth {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}
