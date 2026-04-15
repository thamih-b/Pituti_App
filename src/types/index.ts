// ─────────────────────────────────────────────
// Tipos de dominio — PITUTI
// ─────────────────────────────────────────────

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other'
export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type HabitatType = 'indoor' | 'outdoor' | 'litter_box' | 'cage' | 'aquarium' | 'terrarium'
export type CarePeriod = 'day' | 'week' | 'month'

// Usuario
export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  createdAt: string
}

// Mascota
export interface Pet {
  id: string
  name: string
  species: Species
  breed?: string
  birthDate?: string
  photoUrl?: string
  ownerId: string
  createdAt: string
}

// Cuidador compartido
export interface Caregiver {
  id: string
  petId: string
  userId: string
  name: string
  email: string
  role: 'owner' | 'caregiver' | 'readonly'
  joinedAt: string
}

// Vacuna
export interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDueDate?: string
  veterinary?: string
  notes?: string
}

// Medicamento
export interface Medication {
  id: string
  petId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  notes?: string
}

// Síntoma
export interface Symptom {
  id: string
  petId: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  date: string
  resolved: boolean
}

// Registro de alimentación
export interface FeedingLog {
  id: string
  petId: string
  date: string
  food: string
  amount?: string
  notes?: string
}

// Nota
export interface Note {
  id: string
  petId: string
  content: string
  veterinary?: string
  createdAt: string
}

// Documento
export interface DocumentFile {
  id: string
  petId: string
  name: string
  url: string
  type: string
  uploadedAt: string
}

// Actividad del log
export interface ActivityLog {
  id: string
  petId: string
  action: string
  description: string
  timestamp: string
}

// Cuidado diario
export interface CareItem {
  id: string
  petId: string
  name: string
  emoji: string
  habitatType: HabitatType
  timesPerPeriod: number
  period: CarePeriod
  quantity?: string
  notifyPush: boolean
  notifyEmail: boolean
  notifyCaregivers: boolean
}

// Registro de cuidado diario (check-in)
export interface CareLog {
  id: string
  careItemId: string
  petId: string
  doneAt: string
  doneBy: string
}

// Alerta para el dashboard
export interface PetAlert {
  type: 'warn' | 'err' | 'info'
  text: string
}
