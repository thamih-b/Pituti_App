// src/api/mappers.ts
import type {
  ApiAppointment,
  ApiCare,
  ApiMedicalProfile,
  ApiMedication,
  ApiNote,
  ApiPet,
  ApiSymptom,
  ApiVaccine,
  CreateAppointmentDto,
  CreateCareDto,
  CreateMedicationDto,
  CreateNoteDto,
  CreatePetDto,
  CreateSymptomDto,
  CreateVaccineDto,
  UpdateAppointmentDto,
  UpdateCareDto,
  UpdateMedicationDto,
  UpdateNoteDto,
  UpdatePetDto,
  UpdateSymptomDto,
  UpdateVaccineDto,
  UpsertMedicalProfileDto,
} from './types'

// Request mappers

export function toApiCreatePetDto(dto: CreatePetDto) {
  return {
    name: dto.name,
    species: dto.species,
    breed: dto.breed,
    birthdate: dto.birthDate,
    photourl: dto.photoUrl,
    color: dto.color,
    microchip: dto.microchip,
    passport: dto.passport,
    ownerId: dto.ownerId,
  }
}

export function toApiUpdatePetDto(dto: UpdatePetDto) {
  return {
    name: dto.name,
    species: dto.species,
    breed: dto.breed,
    birthdate: dto.birthDate,
    photourl: dto.photoUrl,
    color: dto.color,
    microchip: dto.microchip,
    passport: dto.passport,
  }
}

export function toApiCreateVaccineDto(dto: CreateVaccineDto) {
  return {
    name: dto.name,
    vaccinedate: dto.date,
    nextdosedate: dto.nextDueDate,
    veterinarian: dto.veterinary,
    notes: dto.notes,
  }
}

export function toApiUpdateVaccineDto(dto: UpdateVaccineDto) {
  return {
    name: dto.name,
    vaccinedate: dto.date,
    nextdosedate: dto.nextDueDate,
    veterinarian: dto.veterinary,
    notes: dto.notes,
  }
}

export function toApiCreateMedicationDto(dto: CreateMedicationDto) {
  return {
    name: dto.name,
    dosage: dto.dosage,
    frequency: dto.frequency,
    startdate: dto.startDate,
    enddate: dto.endDate,
    notes: dto.notes,
  }
}

export function toApiUpdateMedicationDto(dto: UpdateMedicationDto) {
  return {
    name: dto.name,
    dosage: dto.dosage,
    frequency: dto.frequency,
    startdate: dto.startDate,
    enddate: dto.endDate,
    notes: dto.notes,
  }
}

export function toApiCreateSymptomDto(dto: CreateSymptomDto) {
  return {
    symptom: dto.description,
    severity: dto.severity,
    description: dto.notes,
    observeddate: dto.date,
    resolved: dto.resolved,
  }
}

export function toApiUpdateSymptomDto(dto: UpdateSymptomDto) {
  return {
    symptom: dto.description,
    severity: dto.severity,
    description: dto.notes,
    observeddate: dto.date,
    resolved: dto.resolved,
  }
}

export function toApiCreateCareDto(dto: CreateCareDto) {
  const periodtype =
    dto.periodType === 'day'
      ? 'daily'
      : dto.periodType === 'week'
      ? 'weekly'
      : dto.periodType === 'month'
      ? 'monthly'
      : undefined

  return {
    name: dto.name,
    type: dto.type,
    frequency: dto.frequency != null ? String(dto.frequency) : undefined,
    periodtype,
    notes: dto.notes,
  }
}

export function toApiUpdateCareDto(dto: UpdateCareDto) {
  const periodtype =
    dto.periodType === 'day'
      ? 'daily'
      : dto.periodType === 'week'
      ? 'weekly'
      : dto.periodType === 'month'
      ? 'monthly'
      : undefined

  return {
    name: dto.name,
    type: dto.type,
    frequency: dto.frequency != null ? String(dto.frequency) : undefined,
    periodtype,
    notes: dto.notes,
  }
}

export function toApiCreateNoteDto(dto: CreateNoteDto) {
  return {
    content: dto.content,
    title: dto.type,
    notedate: new Date().toISOString().split('T')[0],
  }
}

export function toApiUpdateNoteDto(dto: UpdateNoteDto) {
  return {
    content: dto.content,
    title: dto.type,
  }
}

export function toApiCreateAppointmentDto(dto: CreateAppointmentDto) {
  return {
    petid: dto.petId,
    vetname: dto.vetName,
    clinic: dto.clinic,
    date: dto.date,
    type: dto.type,
    reason: dto.reason,
    diagnosis: dto.diagnosis,
    treatment: dto.treatment,
    nextappointmentdate: dto.nextAppointmentDate,
    nextappointmentnote: dto.nextAppointmentNote,
    weightkg: dto.weightKg,
    cost: dto.cost,
    notes: dto.notes,
  }
}

export function toApiUpdateAppointmentDto(dto: UpdateAppointmentDto) {
  return {
    petid: dto.petId,
    vetname: dto.vetName,
    clinic: dto.clinic,
    date: dto.date,
    type: dto.type,
    reason: dto.reason,
    diagnosis: dto.diagnosis,
    treatment: dto.treatment,
    nextappointmentdate: dto.nextAppointmentDate,
    nextappointmentnote: dto.nextAppointmentNote,
    weightkg: dto.weightKg,
    cost: dto.cost,
    notes: dto.notes,
  }
}

export function toApiMedicalProfileDto(dto: UpsertMedicalProfileDto) {
  return {
    bloodtype: dto.bloodType,
    notes: dto.vetQuestions,
  }
}

// Response mappers

export function mapApiPet(apiPet: any): ApiPet {
  return {
    id: apiPet.id,
    name: apiPet.name,
    species: apiPet.species,
    breed: apiPet.breed ?? null,
    birthDate: apiPet.birthDate ?? apiPet.birthdate ?? null,
    photoUrl: apiPet.photoUrl ?? apiPet.photourl ?? null,
    color: apiPet.color ?? null,
    microchip: apiPet.microchip ?? null,
    passport: apiPet.passport ?? null,
    ownerId: apiPet.ownerId ?? apiPet.ownerid,
    createdAt: apiPet.createdAt ?? apiPet.createdat,
  }
}

export function mapApiVaccine(apiVaccine: any): ApiVaccine {
  return {
    id: apiVaccine.id,
    petId: apiVaccine.petId ?? apiVaccine.petid,
    name: apiVaccine.name,
    date: apiVaccine.date ?? apiVaccine.vaccineDate ?? apiVaccine.vaccinedate,
    nextDueDate:
      apiVaccine.nextDueDate ??
      apiVaccine.nextDoseDate ??
      apiVaccine.nextdosedate ??
      null,
    veterinary: apiVaccine.veterinary ?? apiVaccine.veterinarian ?? null,
    notes: apiVaccine.notes ?? null,
    createdAt: apiVaccine.createdAt ?? apiVaccine.createdat,
  }
}

export function mapApiMedication(apiMedication: any): ApiMedication {
  return {
    id: apiMedication.id,
    petId: apiMedication.petId ?? apiMedication.petid,
    name: apiMedication.name,
    dosage: apiMedication.dosage,
    frequency: apiMedication.frequency,
    startDate: apiMedication.startDate ?? apiMedication.startdate ?? null,
    endDate: apiMedication.endDate ?? apiMedication.enddate ?? null,
    notes: apiMedication.notes ?? null,
    createdAt: apiMedication.createdAt ?? apiMedication.createdat,
  }
}

export function mapApiSymptom(apiSymptom: any): ApiSymptom {
  return {
    id: apiSymptom.id,
    petId: apiSymptom.petId ?? apiSymptom.petid,
    description: apiSymptom.description ?? apiSymptom.symptom,
    severity: apiSymptom.severity,
    date: apiSymptom.date ?? apiSymptom.observedDate ?? apiSymptom.observeddate,
    notes: apiSymptom.notes ?? apiSymptom.description ?? null,
    resolved: apiSymptom.resolved ?? false,
    createdAt: apiSymptom.createdAt ?? apiSymptom.createdat,
  }
}

export function mapApiCare(apiCare: any): ApiCare {
  const rawPeriod = apiCare.periodType ?? apiCare.periodtype

  const periodType =
    rawPeriod === 'daily'
      ? 'day'
      : rawPeriod === 'weekly'
      ? 'week'
      : rawPeriod === 'monthly'
      ? 'month'
      : null

  return {
    id: apiCare.id,
    petId: apiCare.petId ?? apiCare.petid,
    name: apiCare.name,
    type: apiCare.type,
    frequency:
      apiCare.frequency == null ? null : Number(apiCare.frequency),
    periodType,
    time: apiCare.time ?? null,
    notes: apiCare.notes ?? null,
    status: apiCare.status ?? undefined,
    createdAt: apiCare.createdAt ?? apiCare.createdat,
  }
}

export function mapApiNote(apiNote: any): ApiNote {
  return {
    id: apiNote.id,
    petId: apiNote.petId ?? apiNote.petid,
    content: apiNote.content,
    veterinary: apiNote.veterinary ?? null,
    type: apiNote.type ?? apiNote.title ?? undefined,
    createdAt:
      apiNote.createdAt ??
      apiNote.createdat ??
      apiNote.noteDate ??
      apiNote.notedate,
  }
}

export function mapApiAppointment(apiAppointment: any): ApiAppointment {
  return {
    id: apiAppointment.id,
    petId: apiAppointment.petId ?? apiAppointment.petid,
    vetId: apiAppointment.vetId ?? apiAppointment.vetid,
    vetName: apiAppointment.vetName ?? apiAppointment.vetname,
    clinic: apiAppointment.clinic ?? null,
    date: apiAppointment.date,
    type: apiAppointment.type ?? 'other',
    reason: apiAppointment.reason ?? '',
    diagnosis: apiAppointment.diagnosis ?? null,
    treatment: apiAppointment.treatment ?? null,
    nextAppointmentDate:
      apiAppointment.nextAppointmentDate ??
      apiAppointment.nextappointmentdate ??
      null,
    nextAppointmentNote:
      apiAppointment.nextAppointmentNote ??
      apiAppointment.nextappointmentnote ??
      null,
    weightKg: apiAppointment.weightKg ?? apiAppointment.weightkg ?? null,
    cost: apiAppointment.cost ?? null,
    notes: apiAppointment.notes ?? null,
    createdAt: apiAppointment.createdAt ?? apiAppointment.createdat,
  }
}

export function mapApiMedicalProfile(apiProfile: any): ApiMedicalProfile {
  return {
    petId: apiProfile.petId ?? apiProfile.petid,
    sex: apiProfile.sex,
    neutered: apiProfile.neutered ?? null,
    neuteredAge: apiProfile.neuteredAge ?? null,
    bloodType: apiProfile.bloodType ?? apiProfile.bloodtype ?? null,
    allergies: apiProfile.allergies ?? [],
    conditions: apiProfile.conditions ?? [],
    surgeries: apiProfile.surgeries ?? [],
    environment: apiProfile.environment ?? null,
    livingWithAnimals: apiProfile.livingWithAnimals ?? null,
    behavioralNotes: apiProfile.behavioralNotes ?? null,
    vetQuestions: apiProfile.vetQuestions ?? apiProfile.notes ?? null,
    updatedAt: apiProfile.updatedAt ?? apiProfile.updatedat ?? null,
  }
}