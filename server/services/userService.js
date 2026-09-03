// server/services/userService.js
import { sql } from '../db.js'

function notFound(msg) { const e = new Error(msg); e.statusCode = 404; throw e }
function conflict(msg) { const e = new Error(msg); e.statusCode = 409; throw e }

// FIX (perfil não persiste): phone/bio/city/language nunca eram lidos nem
// gravados aqui — só name/email/photoUrl. As colunas já existem (migrations
// 003_users_profile_fields.sql e 005_users_language.sql).
const SELECT_FIELDS = `id, name, email, photo_url AS "photoUrl", phone, bio, city, language, created_at AS "createdAt"`

export const userService = {
  async getAll() {
    return sql`SELECT ${sql.unsafe(SELECT_FIELDS)} FROM users ORDER BY created_at DESC`
  },
  async getById(id) {
    const rows = await sql`SELECT ${sql.unsafe(SELECT_FIELDS)} FROM users WHERE id = ${id}`
    if (!rows[0]) notFound('Usuario no encontrado')
    return rows[0]
  },
  async create(data) {
    const exists = await sql`SELECT id FROM users WHERE email = ${data.email}`
    if (exists.length) conflict('Ya existe un usuario con ese email')
    const [row] = await sql`
      INSERT INTO users (name, email, photo_url, phone, bio, city, language)
      VALUES (${data.name}, ${data.email}, ${data.photoUrl ?? null},
              ${data.phone ?? null}, ${data.bio ?? null}, ${data.city ?? null},
              ${data.language ?? null})
      RETURNING ${sql.unsafe(SELECT_FIELDS)}`
    return row
  },
  async update(id, data) {
    await this.getById(id)
    const [row] = await sql`
      UPDATE users SET
        name      = COALESCE(${data.name ?? null}, name),
        email     = COALESCE(${data.email ?? null}, email),
        photo_url = COALESCE(${data.photoUrl ?? null}, photo_url),
        phone     = COALESCE(${data.phone ?? null}, phone),
        bio       = COALESCE(${data.bio ?? null}, bio),
        city      = COALESCE(${data.city ?? null}, city),
        language  = COALESCE(${data.language ?? null}, language)
      WHERE id = ${id}
      RETURNING ${sql.unsafe(SELECT_FIELDS)}`
    return row
  },
  async delete(id) {
    await this.getById(id)
    await sql`DELETE FROM users WHERE id = ${id}`
  },
}
