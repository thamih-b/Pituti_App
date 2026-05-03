/**  * Generic sub-resource service factory
 * Layer: Services
 *
 * All pet-scoped resources (vaccines, medications, symptoms, cares, notes)
 * share the same CRUD pattern. This factory avoids ~200 lines of repetition.  */

import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, filterMap } from '../data/helpers.js';

export function createSubResourceService(storeKey, entityName) {
  return {
    getAllForPet(petId) {
      assertExists(store.pets, petId, 'Mascota');
      return filterMap(store[storeKey], item => item.petId === petId)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    },

    getById(petId, id) {
      assertExists(store.pets, petId, 'Mascota');
      const item = assertExists(store[storeKey], id, entityName);
      if (item.petId !== petId) {
        const err = new Error(`${entityName} no pertenece a esta mascota`);
        err.statusCode = 404;
        throw err;
      }
      return item;
    },

    create(petId, data) {
      assertExists(store.pets, petId, 'Mascota');
      const item = {
        ...data,
        petId,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      store[storeKey].set(item.id, item);
      return item;
    },

    update(petId, id, data) {
      const item = this.getById(petId, id);
      const updated = { ...item, ...data };
      store[storeKey].set(id, updated);
      return updated;
    },

    delete(petId, id) {
      this.getById(petId, id);
      store[storeKey].delete(id);
    },
  };
}
