/**  * In-memory data store with seed data
 * Layer: Data — replace Map operations with DB calls in services for production  */

import { v4 as uuid } from 'uuid';

export const store = {
  users:          new Map(),
  pets:           new Map(),
  vaccines:       new Map(),
  medications:    new Map(),
  symptoms:       new Map(),
  cares:          new Map(),
  notes:          new Map(),
  medicalProfiles:new Map(),
  vets:           new Map(),
  appointments:   new Map(),
};

// ── Seed demo data ────────────────────────────────────────────────────────────
const demoUserId  = 'user-demo-001';
const demoPetId1  = 'pet-demo-001';
const demoPetId2  = 'pet-demo-002';
export const vetId = 'vet-demo-001';

store.users.set(demoUserId, {
  id: demoUserId,
  name: 'María García',
  email: 'maria@pituti.app',
  photoUrl: null,
  createdAt: '2024-01-15T10:00:00.000Z',
});

store.pets.set(demoPetId1, {
  id: demoPetId1,
  name: 'Luna',
  species: 'cat',
  breed: 'Siamés',
  birthDate: '2020-03-12',
  photoUrl: null,
  ownerId: demoUserId,
  createdAt: '2024-01-15T10:05:00.000Z',
});

store.pets.set(demoPetId2, {
  id: demoPetId2,
  name: 'Rocky',
  species: 'dog',
  breed: 'Labrador',
  birthDate: '2019-07-04',
  photoUrl: null,
  ownerId: demoUserId,
  createdAt: '2024-01-15T10:06:00.000Z',
});

store.vaccines.set('vacc-demo-001', {
  id: 'vacc-demo-001',
  petId: demoPetId1,
  name: 'Triple felina',
  date: '2024-06-01',
  nextDueDate: '2025-06-01',
  veterinary: 'Dra. Martínez',
  notes: 'Sin reacciones adversas',
  createdAt: '2024-06-01T09:00:00.000Z',
});

store.vaccines.set('vacc-demo-002', {
  id: 'vacc-demo-002',
  petId: demoPetId2,
  name: 'Polivalente',
  date: '2024-03-15',
  nextDueDate: '2025-03-15',
  veterinary: 'Dra. Martínez',
  notes: null,
  createdAt: '2024-03-15T10:00:00.000Z',
});

store.medications.set('med-demo-001', {
  id: 'med-demo-001',
  petId: demoPetId2,
  name: 'Frontline Plus',
  dosage: '1 pipeta',
  frequency: 'monthly',
  startDate: '2024-01-01',
  endDate: null,
  notes: 'Antiparasitario externo',
  createdAt: '2024-01-15T11:00:00.000Z',
});

store.symptoms.set('sym-demo-001', {
  id: 'sym-demo-001',
  petId: demoPetId2,
  description: 'Tos suave sin fiebre. Parece cansado.',
  severity: 'mild',
  date: '2026-04-18',
  notes: 'Come normal.',
  resolved: false,
  createdAt: '2026-04-18T08:00:00.000Z',
});

store.cares.set('care-demo-001', {
  id: 'care-demo-001',
  petId: demoPetId1,
  name: 'Alimentación',
  type: 'food',
  frequency: 2,
  periodType: 'day',
  time: '08:00',
  notes: '80g pienso seco',
  status: 'pending',
  createdAt: '2024-01-15T12:00:00.000Z',
});

store.vets.set(vetId, {
  id: vetId,
  name: 'Dra. Ana Martínez',
  clinic: 'Clínica VetSalud',
  type: 'primary',
  specialty: null,
  phone: '+34 612 345 678',
  phone2: null,
  address: 'Calle Mayor 12, Madrid',
  notes: 'Atiende lunes a viernes 9-18h',
  petIds: [demoPetId1, demoPetId2],
  createdAt: '2024-01-15T12:00:00.000Z',
});

store.appointments.set('appt-demo-001', {
  id: 'appt-demo-001',
  petId: demoPetId1,
  vetContactId: vetId,
  vetName: 'Dra. Ana Martínez',
  clinic: 'Clínica VetSalud',
  type: 'routine',
  date: '2026-03-10',
  reason: 'Revisión anual',
  diagnosis: 'Animal sano',
  treatment: null,
  nextAppointmentDate: '2027-03-10',
  nextAppointmentNote: 'Revisión anual',
  weightKg: 3.8,
  notes: null,
  createdAt: '2026-03-10T10:00:00.000Z',
});

store.medicalProfiles.set(demoPetId1, {
  petId: demoPetId1,
  sex: 'female',
  neutered: true,
  neuteredAge: '8 meses',
  bloodType: 'A',
  allergies: [],
  conditions: [],
  surgeries: [{ name: 'Esterilización', notes: 'Sin complicaciones' }],
  environment: 'apartment',
  livingWithAnimals: false,
  behavioralNotes: 'Tímida con extraños',
  vetQuestions: null,
  updatedAt: '2024-06-01T09:00:00.000Z',
});

export { demoUserId, demoPetId1, demoPetId2 };
