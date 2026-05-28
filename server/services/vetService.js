// server/services/vetService.js
import { sql } from '../db.js'
import { createError } from '../data/helpers.js'
import { HTTP } from '../config/httpStatus.js'

export const vetService = {
  async getAll() {
    return sql`SELECT id, owner_id AS "ownerId", name, clinic, type, specialty,
                      phone, phone2, address, notes, created_at AS "createdAt"
               FROM vets ORDER BY created_at DESC`
  },

  async getById(id) {
    const rows = await sql`
      SELECT id, owner_id AS "ownerId", name, clinic, type, specialty,
             phone, phone2, address, notes, created_at AS "createdAt"
      FROM vets WHERE id = ${id}`
    if (!rows[0]) throw createError('Veterinario no encontrado', HTTP.NOT_FOUND)
    return rows[0]
  },

  async create(data) {
    const [row] = await sql`
      INSERT INTO vets (name, clinic, type, specialty, phone, phone2, address, notes)
      VALUES (${data.name}, ${data.clinic}, ${data.type ?? 'primary'},
              ${data.specialty ?? null}, ${data.phone}, ${data.phone2 ?? null},
              ${data.address ?? null}, ${data.notes ?? null})
      RETURNING id, owner_id AS "ownerId", name, clinic, type, specialty,
                phone, phone2, address, notes, created_at AS "createdAt"`
    return row
  },

  async update(id, data) {
    await this.getById(id)
    const [row] = await sql`
      UPDATE vets SET
        name      = COALESCE(${data.name ?? null}, name),
        clinic    = COALESCE(${data.clinic ?? null}, clinic),
        type      = COALESCE(${data.type ?? null}, type),
        specialty = COALESCE(${data.specialty ?? null}, specialty),
        phone     = COALESCE(${data.phone ?? null}, phone),
        phone2    = COALESCE(${data.phone2 ?? null}, phone2),
        address   = COALESCE(${data.address ?? null}, address),
        notes     = COALESCE(${data.notes ?? null}, notes)
      WHERE id = ${id}
      RETURNING id, owner_id AS "ownerId", name, clinic, type, specialty,
                phone, phone2, address, notes, created_at AS "createdAt"`
    return row
  },

  async delete(id) {
    await this.getById(id)
    await sql`DELETE FROM vets WHERE id = ${id}`
  },
}
