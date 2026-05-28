// src/api/index.ts
export { api, BASE_URL, getToken, setToken, clearToken } from './client'
export type { ApiResponse, ApiError } from './client'

export { authApi }                from './auth'
export { petsApi }                from './pets'
export { vetsApi }                from './vets'
export { appointmentsApi }        from './appointments'
export { medicationsApi }         from './medications'
export { symptomsApi }            from './symptoms'
export { caresApi }               from './cares'
export { notesApi }               from './notes'
export { medicalProfilesApi }     from './medicalProfiles'
export { usersApi }               from './users'
export { default as vaccinesApi } from './vaccines'

export type {
  ApiPet, ApiVet, ApiAppointment, ApiMedication,
  ApiSymptom, ApiCare, ApiVaccine, ApiNote,
  ApiMedicalProfile, ApiUser,
  CreatePetDto, UpdatePetDto,
  CreateVetDto, UpdateVetDto,
  CreateVaccineDto, UpdateVaccineDto,
  CreateMedicationDto, UpdateMedicationDto,
  CreateSymptomDto, UpdateSymptomDto,
  CreateCareDto, UpdateCareDto,
  CreateNoteDto, UpdateNoteDto,
  CreateAppointmentDto, UpdateAppointmentDto,
  UpsertMedicalProfileDto,
  LoginDto, RegisterDto, AuthResponse, AuthUser,
} from './types'