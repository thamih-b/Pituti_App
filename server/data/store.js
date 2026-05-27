/**
 * In-memory data store
 * Layer: Data — replace Map operations with DB calls in services for production
 */

export const store = {
  users: new Map(),
  pets: new Map(),
  vaccines: new Map(),
  medications: new Map(),
  symptoms: new Map(),
  cares: new Map(),
  notes: new Map(),
  medicalProfiles: new Map(),
  vets: new Map(),
  appointments: new Map(),
}