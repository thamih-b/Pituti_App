import { store } from '../data/store.js';
import { assertExists } from '../data/helpers.js';

export const medicalProfileService = {
  get(petId) {
    assertExists(store.pets, petId, 'Mascota');
    return store.medicalProfiles.get(petId) ?? buildDefault(petId);
  },

  upsert(petId, data) {
    assertExists(store.pets, petId, 'Mascota');
    const current = store.medicalProfiles.get(petId) ?? buildDefault(petId);
    const updated = { ...current, ...data, petId, updatedAt: new Date().toISOString() };
    store.medicalProfiles.set(petId, updated);
    return updated;
  },
};

function buildDefault(petId) {
  return {
    petId,
    sex: 'unknown',
    neutered: null,
    neuteredAge: null,
    bloodType: null,
    allergies: [],
    conditions: [],
    surgeries: [],
    environment: null,
    livingWithAnimals: null,
    behavioralNotes: null,
    vetQuestions: null,
    updatedAt: null,
  };
}
