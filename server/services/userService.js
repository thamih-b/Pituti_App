// server/services/userService.js
import { sql } from '../db.js'

function notFound(msg) { const e = new Error(msg); e.statusCode = 404; throw e }
function conflict(msg) { const e = new Error(msg); e.statusCode = 409; throw e }

export const userService = {
  async getAll() {
    return sql`SELECT id, name, email, photo_url AS "photoUrl", created_at AS "createdAt"
               FROM users ORDER BY created_at DESC`
  },
  async getById(id) {
    const rows = await sql`SELECT id, name, email, photo_url AS "photoUrl", created_at AS "createdAt"
                           FROM users WHERE id = ${id}`
    if (!rows[0]) notFound('Usuario no encontrado')
    return rows[0]
  },
  async create(data) {
    const exists = await sql`SELECT id FROM users WHERE email = ${data.email}`
    if (exists.length) conflict('Ya existe un usuario con ese email')
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
