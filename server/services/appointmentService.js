// server/services/appointmentService.js
import { sql } from '../db.js'
import { createError } from '../data/helpers.js'
import { HTTP } from '../config/httpStatus.js'

function fromRow(r) {
  return {
    id: r.id, petId: r.pet_id, vetId: r.vet_contact_id,
    vetName: r.vet_name, clinic: r.clinic, type: r.type,
    date: r.date, reason: r.reason, diagnosis: r.diagnosis,
    treatment: r.treatment,
    nextAppointmentDate: r.next_appointment_date,
    nextAppointmentNote: r.next_appointment_note,
    weightKg: r.weight_kg, cost: r.cost, notes: r.notes,
    createdAt: r.created_at,
  }
}

export const appointmentService = {
  async getAllForVet(vetId) {
    const rows = await sql`
      SELECT * FROM appointments
      WHERE vet_contact_id = ${vetId}
      ORDER BY date DESC`
    return rows.map(fromRow)
  },

  async getById(id) {
    const rows = await sql`SELECT * FROM appointments WHERE id = ${id}`
    if (!rows[0]) throw createError('Consulta no encontrada', HTTP.NOT_FOUND)
    return fromRow(rows[0])
  },

  async create(vetId, data) {
    const [row] = await sql`
      INSERT INTO appointments
        (pet_id, vet_contact_id, vet_name, clinic, type, date, reason,
         diagnosis, treatment, next_appointment_date, next_appointment_note,
         weight_kg, cost, notes)
      VALUES
        (${data.petId}, ${vetId}, ${data.vetName}, ${data.clinic ?? null},
         ${data.type ?? 'routine'}, ${data.date}, ${data.reason},
         ${data.diagnosis ?? null}, ${data.treatment ?? null},
         ${data.nextAppointmentDate ?? null}, ${data.nextAppointmentNote ?? null},
         ${data.weightKg ?? null}, ${data.cost ?? null}, ${data.notes ?? null})
      RETURNING *`
    return fromRow(row)
  },

  async update(vetId, id, data) {
    await this.getById(id)
    const [row] = await sql`
      UPDATE appointments SET
        vet_name              = COALESCE(${data.vetName ?? null}, vet_name),
        clinic                = COALESCE(${data.clinic ?? null}, clinic),
        type                  = COALESCE(${data.type ?? null}, type),
        date                  = COALESCE(${data.date ?? null}::date, date),
        reason                = COALESCE(${data.reason ?? null}, reason),
        diagnosis             = COALESCE(${data.diagnosis ?? null}, diagnosis),
        treatment             = COALESCE(${data.treatment ?? null}, treatment),
        next_appointment_date = COALESCE(${data.nextAppointmentDate ?? null}::date, next_appointment_date),
        next_appointment_note = COALESCE(${data.nextAppointmentNote ?? null}, next_appointment_note),
        weight_kg             = COALESCE(${data.weightKg ?? null}, weight_kg),
        cost                  = COALESCE(${data.cost ?? null}, cost),
        notes                 = COALESCE(${data.notes ?? null}, notes)
      WHERE id = ${id} RETURNING *`
    return fromRow(row)
  },

  async delete(vetId, id) {
    await this.getById(id)
    await sql`DELETE FROM appointments WHERE id = ${id}`
  },
}
