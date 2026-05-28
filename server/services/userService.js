// server/services/userService.js
import { sql } from '../db.js'
import { createError } from '../data/helpers.js'
import { HTTP } from '../config/httpStatus.js'

export const userService = {
  async getAll() {
    return sql`SELECT id, name, email, photo_url AS "photoUrl", created_at AS "createdAt"
               FROM users ORDER BY created_at DESC`
  },

  async getById(id) {
    const rows = await sql`
      SELECT id, name, email, photo_url AS "photoUrl", created_at AS "createdAt"
      FROM users WHERE id = ${id}`
    if (!rows[0]) throw createError('Usuario no encontrado', HTTP.NOT_FOUND)
    return rows[0]
  },

  async create(data) {
    const exists = await sql`SELECT id FROM users WHERE email = ${data.email}`
    if (exists.length) throw createError('Ya existe un usuario con ese email', HTTP.CONFLICT)
    const [row] = await sql`
      INSERT INTO users (name, email, photo_url)
      VALUES (${data.name}, ${data.email}, ${data.photoUrl ?? null})
      RETURNING id, name, email, photo_url AS "photoUrl", created_at AS "createdAt"`
    return row
  },

  async update(id, data) {
    await this.getById(id)
    const [row] = await sql`
      UPDATE users SET
        name      = COALESCE(${data.name ?? null}, name),
        email     = COALESCE(${data.email ?? null}, email),
        photo_url = COALESCE(${data.photoUrl ?? null}, photo_url)
      WHERE id = ${id}
      RETURNING id, name, email, photo_url AS "photoUrl", created_at AS "createdAt"`
    return row
  },

  async delete(id) {
    await this.getById(id)
    await sql`DELETE FROM users WHERE id = ${id}`
  },
}
