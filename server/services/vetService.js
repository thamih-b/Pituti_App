import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists } from '../data/helpers.js';

export const vetService = {
  getAll() {
    return [...store.vets.values()];
  },

  getById(id) {
    return assertExists(store.vets, id, 'Veterinario');
  },

  create(data) {
    const vet = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    store.vets.set(vet.id, vet);
    return vet;
  },

  update(id, data) {
    const vet = assertExists(store.vets, id, 'Veterinario');
    const updated = { ...vet, ...data };
    store.vets.set(id, updated);
    return updated;
  },

  delete(id) {
    assertExists(store.vets, id, 'Veterinario');
    store.vets.delete(id);
  },
};
