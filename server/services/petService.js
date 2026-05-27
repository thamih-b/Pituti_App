import { v4 as uuid } from 'uuid'
import { store } from '../data/store.js'
import { assertExists, filterMap } from '../data/helpers.js'

export const petService = {
  getAll(ownerId) {
    const pets = ownerId
      ? filterMap(store.pets, (p) => p.ownerId === ownerId)
      : [...store.pets.values()]

    return pets.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },

  getById(id) {
    return assertExists(store.pets, id, 'Mascota')
  },

  create(data) {
    if (!data?.ownerId) {
      const err = new Error('El ownerId es obligatorio')
      err.statusCode = 400
      throw err
    }

    const ownerExists = store.users.has(data.ownerId)

    if (!ownerExists) {
      store.users.set(data.ownerId, {
        id: data.ownerId,
        name: data.ownerName ?? 'User',
        email: data.ownerEmail ?? `${data.ownerId}@pituti.local`,
        photoUrl: null,
        createdAt: new Date().toISOString(),
      })
    }

    const pet = {
      ...data,
      id: uuid(),
      createdAt: new Date().toISOString(),
    }

    store.pets.set(pet.id, pet)
    return pet
  },

  update(id, data) {
    const pet = assertExists(store.pets, id, 'Mascota')
    const updated = { ...pet, ...data }
    store.pets.set(id, updated)
    return updated
  },

  delete(id) {
    assertExists(store.pets, id, 'Mascota')
    store.pets.delete(id)

    for (const [k, v] of store.vaccines) {
      if (v.petId === id) store.vaccines.delete(k)
    }

    for (const [k, v] of store.medications) {
      if (v.petId === id) store.medications.delete(k)
    }

    for (const [k, v] of store.symptoms) {
      if (v.petId === id) store.symptoms.delete(k)
    }

    for (const [k, v] of store.cares) {
      if (v.petId === id) store.cares.delete(k)
    }

    for (const [k, v] of store.notes) {
      if (v.petId === id) store.notes.delete(k)
    }

    store.medicalProfiles.delete(id)
  },
}