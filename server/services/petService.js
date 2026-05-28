// server/services/petService.js
import { sql } from '../db.js'
import { createError } from '../data/helpers.js'
import { HTTP } from '../config/httpStatus.js'

export const petService = {
  async getAll(ownerId) {
    if (!ownerId) {
      const err = createError('ownerId query param is required', HTTP.BAD_REQUEST)
      throw err
    }
    const rows = await sql`
      SELECT id, owner_id AS "ownerId", name, species, breed,
             birth_date AS "birthDate", photo_url AS "photoUrl",
             created_at AS "createdAt"
      FROM pets
      WHERE owner_id = ${ownerId}
      ORDER BY created_at ASC
    `
    return rows
  },

  async getById(id) {
    const rows = await sql`
      SELECT id, owner_id AS "ownerId", name, species, breed,
             birth_date AS "birthDate", photo_url AS "photoUrl",
             created_at AS "createdAt"
      FROM pets WHERE id = ${id}
    `
    if (!rows[0]) {
      const err = createError('Mascota no encontrada', HTTP.NOT_FOUND)
      throw err
    }
    return rows[0]
  },

  async create(data) {
    if (!data?.ownerId) {
      throw createError('El ownerId es obligatorio', HTTP.BAD_REQUEST)
    }
    const [row] = await sql`
      INSERT INTO pets (owner_id, name, species, breed, birth_date, photo_url)
      VALUES (
        ${data.ownerId},
        ${data.name},
        ${data.species},
        ${data.breed ?? null},
        ${data.birthDate ?? null},
        ${data.photoUrl ?? null}
      )
      RETURNING id, owner_id AS "ownerId", name, species, breed,
                birth_date AS "birthDate", photo_url AS "photoUrl",
                created_at AS "createdAt"
    `
    return row
  },

  async update(id, data) {
    await this.getById(id)
    const [row] = await sql`
      UPDATE pets SET
        name       = COALESCE(${data.name ?? null}, name),
        species    = COALESCE(${data.species ?? null}, species),
        breed      = COALESCE(${data.breed ?? null}, breed),
        birth_date = COALESCE(${data.birthDate ?? null}::date, birth_date),
        photo_url  = COALESCE(${data.photoUrl ?? null}, photo_url)
      WHERE id = ${id}
      RETURNING id, owner_id AS "ownerId", name, species, breed,
                birth_date AS "birthDate", photo_url AS "photoUrl",
                created_at AS "createdAt"
    `
    return row
  },

  async delete(id) {
    await this.getById(id)
    await sql`DELETE FROM pets WHERE id = ${id}`
  },
}
