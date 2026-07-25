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
    birthDate: dto.birthDate,
    photoUrl: dto.photoUrl,
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
    birthDate: dto.birthDate,
    photoUrl: dto.photoUrl,
    color: dto.color,
    microchip: dto.microchip,
    passport: dto.passport,
  }
}


// FIX: 'date' e 'next_due_date' — nomes correctos para a rota de vaccines
export function toApiCreateVaccineDto(dto: CreateVaccineDto) {
  return {
    name:        dto.name,
    date:        dto.date,
    // FIX (sync): a API (server/validators/vaccineValidators.js) espera 'nextDueDate'
    // (camelCase) — 'next_due_date' era ignorado, então a data da próxima dose
    // nunca era gravada no servidor.
    nextDueDate: dto.nextDueDate,
    veterinary:  dto.veterinary,
    notes:       dto.notes,
  }
}

export function toApiUpdateVaccineDto(dto: UpdateVaccineDto) {
  return {
    name: dto.name,
    date: dto.date,
    // FIX (sync): idem — camelCase, não snake_case
    nextDueDate: dto.nextDueDate,
    veterinary: dto.veterinary,
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
  return {
    name: dto.name,
    type: dto.type,
    frequency: dto.frequency != null ? Number(dto.frequency) : undefined,
    // FIX (cares não registavam): a API (server/validators/careValidators.js)
    // espera a chave 'periodType' (camelCase, não 'periodtype') com os valores
    // exactos 'day' | 'week' | 'month' — enviar 'daily'/'weekly'/'monthly'
    // fazia o Zod rejeitar o pedido inteiro (400), por isso nenhum cuidado
    // chegava a ser criado no servidor.
    periodType: dto.periodType ?? undefined,
    // FIX: time e status estavam a ser descartados aqui e nunca chegavam à API
    time: dto.time ?? undefined,
    status: dto.status ?? undefined,
    notes: dto.notes,
  }
}

export function toApiUpdateCareDto(dto: UpdateCareDto) {
  return {
    name: dto.name,
    type: dto.type,
    frequency: dto.frequency != null ? Number(dto.frequency) : undefined,
    // FIX: mesma correção de periodType (ver toApiCreateCareDto)
    periodType: dto.periodType ?? undefined,
    time: dto.time ?? undefined,
    status: dto.status ?? undefined,
    notes: dto.notes,
  }
}

// FIX: envia 'veterinary' em vez de 'vet' — nome correcto no schema do DB
export function toApiCreateNoteDto(dto: CreateNoteDto) {
  return {
    type:       dto.type,
    content:    dto.content,
    date:       dto.date,
    veterinary: dto.vet,  // ← FIX: 'vet' do frontend → 'veterinary' na DB
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
    birthDate: apiPet.birthDate ?? apiPet.birthDate ?? null,
    photoUrl: apiPet.photoUrl ?? apiPet.photoUrl ?? null,
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

  // FIX (sync): o servidor (server/validators/careValidators.js) guarda e
  // devolve exactamente 'day' | 'week' | 'month' — não 'daily'/'weekly'/'monthly'.
  // A conversão antiga nunca reconhecia o valor real vindo da API e o período
  // voltava sempre como null ao recarregar a página / mudar de aparelho.
  const periodType =
    rawPeriod === 'day' || rawPeriod === 'week' || rawPeriod === 'month'
      ? rawPeriod
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

export function mapApiNote(raw: any): ApiNote {
  return {
    id:        raw.id,
    petId:     raw.petId   ?? raw.pet_id,
    type:      raw.type,
    content:   raw.content,
    // FIX: aceita tanto 'vet' como 'veterinary' da API
    veterinary:       raw.vet     ?? raw.veterinary ?? null,
    createdAt: raw.createdAt ?? raw.created_at,
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