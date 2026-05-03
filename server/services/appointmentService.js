import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, filterMap } from '../data/helpers.js';

export const appointmentService = {
  getAllForVet(vetId) {
    assertExists(store.vets, vetId, 'Veterinario');
    return filterMap(store.appointments, a => a.vetContactId === vetId)
      .sort((a, b) => b.date.localeCompare(a.date)); 
  },

  getById(id) {
    return assertExists(store.appointments, id, 'Consulta');
  },

  create(vetId, data) {
    assertExists(store.vets, vetId, 'Veterinario');
    assertExists(store.pets, data.petId, 'Mascota');
    const appt = {
      ...data,
      vetContactId: vetId,
      id: uuid(),
      createdAt: new Date().toISOString(),
    };
    store.appointments.set(appt.id, appt);
    return appt;
  },

  update(vetId, id, data) {
    assertExists(store.vets, vetId, 'Veterinario');
    const appt = assertExists(store.appointments, id, 'Consulta');
    const updated = { ...appt, ...data };
    store.appointments.set(id, updated);
    return updated;
  },

  delete(vetId, id) {
    assertExists(store.vets, vetId, 'Veterinario');
    assertExists(store.appointments, id, 'Consulta');
    store.appointments.delete(id);
  },
};
