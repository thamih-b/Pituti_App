// server/services/petService.js
import { sql } from '../db.js'

function notFound(msg) { const e = new Error(msg); e.statusCode = 404; throw e }
function badRequest(msg) { const e = new Error(msg); e.statusCode = 400; throw e }

export const petService = {
  async getAll(ownerId) {
    if (!ownerId) badRequest('ownerId query param is required')
    return sql`
      SELECT id, owner_id AS "ownerId", name, species, breed,
             birth_date AS "birthDate", photo_url AS "photoUrl",
             created_at AS "createdAt"
      FROM pets WHERE owner_id = ${ownerId} ORDER BY created_at ASC`
  },

  async getById(id) {
    const rows = await sql`
      SELECT id, owner_id AS "ownerId", name, species, breed,
             birth_date AS "birthDate", photo_url AS "photoUrl",
             created_at AS "createdAt"
      FROM pets WHERE id = ${id}`
    if (!rows[0]) notFound('Mascota no encontrada')
    return rows[0]
  },

  async create(data) {
    if (!data?.ownerId) badRequest('El ownerId es obligatorio')
    const [row] = await sql`
      INSERT INTO pets (owner_id, name, species, breed, birth_date, photo_url)
      VALUES (${data.ownerId}, ${data.name}, ${data.species},
              ${data.breed ?? null}, ${data.birthDate ?? null}, ${data.photoUrl ?? null})
      RETURNING id, owner_id AS "ownerId", name, species, breed,
                birth_date AS "birthDate", photo_url AS "photoUrl",
                created_at AS "createdAt"`
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
                created_at AS "createdAt"`
    return row
  },

  async delete(id) {
    await this.getById(id)
    await sql`DELETE FROM pets WHERE id = ${id}`
  },
}
