import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, createError } from '../data/helpers.js';
import { HTTP } from '../config/httpStatus.js';

export const userService = {
  getAll() {
    return [...store.users.values()];
  },

  getById(id) {
    return assertExists(store.users, id, 'Usuario');
  },

  create(data) {
    const exists = [...store.users.values()].find(u => u.email === data.email);
    if (exists) throw createError('Ya existe un usuario con ese email', HTTP.CONFLICT);
    const user = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    store.users.set(user.id, user);
    return user;
  },

  update(id, data) {
    const user = assertExists(store.users, id, 'Usuario');
    const updated = { ...user, ...data };
    store.users.set(id, updated);
    return updated;
  },

  delete(id) {
    assertExists(store.users, id, 'Usuario');
    store.users.delete(id);
  },
};
