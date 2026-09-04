// server/services/subResourceService.js
import { sql } from '../db.js'

function notFound(msg) { const e = new Error(msg); e.statusCode = 404; throw e }

function toDateStr(d) {
  if (d == null) return null
  if (typeof d === 'string') return d.slice(0, 10)
  return d.toISOString().slice(0, 10)
}

const CONFIG = {
  vaccines: {
    table: 'vaccines',
    insert: (petId, d) => sql`
      INSERT INTO vaccines (pet_id, name, date, next_due_date, veterinary, notes)
      VALUES (${petId}, ${d.name}, ${d.date}, ${d.nextDueDate ?? null},
              ${d.veterinary ?? null}, ${d.notes ?? null}) RETURNING *`,
    update: (id, d) => sql`
      UPDATE vaccines SET
        name          = COALESCE(${d.name ?? null}, name),
        date          = COALESCE(${d.date ?? null}::date, date),
        next_due_date = COALESCE(${d.nextDueDate ?? null}::date, next_due_date),
        veterinary    = COALESCE(${d.veterinary ?? null}, veterinary),
        notes         = COALESCE(${d.notes ?? null}, notes)
      WHERE id = ${id} RETURNING *`,
    fromRow: r => ({ id: r.id, petId: r.pet_id, name: r.name,
      date: toDateStr(r.date),
      nextDueDate: toDateStr(r.next_due_date),
      veterinary: r.veterinary, notes: r.notes, createdAt: r.created_at }),
  },
  medications: {
    table: 'medications',
    insert: (petId, d) => sql`
      INSERT INTO medications (pet_id, name, dosage, frequency, start_date, end_date, notes)
      VALUES (${petId}, ${d.name}, ${d.dosage}, ${d.frequency},
              ${d.startDate ?? null}, ${d.endDate ?? null}, ${d.notes ?? null}) RETURNING *`,
    update: (id, d) => sql`
      UPDATE medications SET
        name       = COALESCE(${d.name ?? null}, name),
        dosage     = COALESCE(${d.dosage ?? null}, dosage),
        frequency  = COALESCE(${d.frequency ?? null}, frequency),
        start_date = COALESCE(${d.startDate ?? null}::date, start_date),
        end_date   = COALESCE(${d.endDate ?? null}::date, end_date),
        notes      = COALESCE(${d.notes ?? null}, notes)
      WHERE id = ${id} RETURNING *`,
    fromRow: r => ({ id: r.id, petId: r.pet_id, name: r.name, dosage: r.dosage,
      frequency: r.frequency,
      startDate: toDateStr(r.start_date),
      endDate: toDateStr(r.end_date),
      notes: r.notes, createdAt: r.created_at }),
  },
  symptoms: {
    table: 'symptoms',
    insert: (petId, d) => sql`
      INSERT INTO symptoms (pet_id, description, severity, date, notes, resolved)
      VALUES (${petId}, ${d.description}, ${d.severity}, ${d.date},
              ${d.notes ?? null}, ${d.resolved ?? false}) RETURNING *`,
    update: (id, d) => sql`
      UPDATE symptoms SET
        description = COALESCE(${d.description ?? null}, description),
        severity    = COALESCE(${d.severity ?? null}, severity),
        date        = COALESCE(${d.date ?? null}::date, date),
        notes       = COALESCE(${d.notes ?? null}, notes),
        resolved    = COALESCE(${d.resolved ?? null}, resolved)
      WHERE id = ${id} RETURNING *`,
    fromRow: r => ({ id: r.id, petId: r.pet_id, description: r.description,
      severity: r.severity,
      date: toDateStr(r.date),
      notes: r.notes, resolved: r.resolved, createdAt: r.created_at }),
  },
  cares: {
    table: 'cares',
    insert: (petId, d) => sql`
      INSERT INTO cares (pet_id, name, type, frequency, period_type, interval_days, time, notes, status)
      VALUES (${petId}, ${d.name}, ${d.type}, ${d.frequency ?? null},
              ${d.periodType ?? null}, ${d.intervalDays ?? null}, ${d.time ?? null}, ${d.notes ?? null},
              ${d.status ?? 'pending'}) RETURNING *`,
    update: (id, d) => sql`
      UPDATE cares SET
        name          = COALESCE(${d.name ?? null}, name),
        type          = COALESCE(${d.type ?? null}, type),
        frequency     = COALESCE(${d.frequency ?? null}, frequency),
        period_type   = COALESCE(${d.periodType ?? null}, period_type),
        interval_days = COALESCE(${d.intervalDays ?? null}, interval_days),
        time          = COALESCE(${d.time ?? null}, time),
        notes         = COALESCE(${d.notes ?? null}, notes),
        status        = COALESCE(${d.status ?? null}, status),
        done_dates    = COALESCE(${d.doneDates ? JSON.stringify(d.doneDates) : null}::jsonb, done_dates)
      WHERE id = ${id} RETURNING *`,
    fromRow: r => ({ id: r.id, petId: r.pet_id, name: r.name, type: r.type,
      frequency: r.frequency, periodType: r.period_type, intervalDays: r.interval_days, time: r.time,
      notes: r.notes, status: r.status,
      doneDates: typeof r.done_dates === 'string' ? JSON.parse(r.done_dates || '{}') : (r.done_dates ?? {}),
      createdAt: r.created_at }),
  },
  notes: {
    table: 'notes',
    insert: (petId, d) => sql`
      INSERT INTO notes (pet_id, content, veterinary, type)
      VALUES (${petId}, ${d.content}, ${d.veterinary ?? null},
              ${d.type ?? 'observacion'}) RETURNING *`,
    update: (id, d) => sql`
      UPDATE notes SET
        content    = COALESCE(${d.content ?? null}, content),
        veterinary = COALESCE(${d.veterinary ?? null}, veterinary),
        type       = COALESCE(${d.type ?? null}, type)
      WHERE id = ${id} RETURNING *`,
    // FIX: a tabela `notes` não tem coluna `date` — o frontend usa este
    // campo (CreateNoteDto.date / ApiNote.date), mas nunca foi persistido
    // no servidor. Devolvemos sempre null aqui para não fingir um valor;
    // se precisares de guardar a data da nota, é preciso uma migração para
    // adicionar essa coluna (dizes-me e faço).
    fromRow: r => ({ id: r.id, petId: r.pet_id, content: r.content,
      veterinary: r.veterinary, vet: r.veterinary, type: r.type,
      date: null,
      createdAt: r.created_at }),
  },
}

export function createSubResourceService(storeKey) {
  const cfg = CONFIG[storeKey]
  if (!cfg) throw new Error(`No DB config for: ${storeKey}`)
  const { table, insert, update: updateSql, fromRow } = cfg

  return {
    async getAllForPet(petId) {
      const rows = await sql`SELECT * FROM ${sql.unsafe(table)} WHERE pet_id = ${petId} ORDER BY created_at DESC`
      return rows.map(fromRow)
    },
    async getById(petId, id) {
      const rows = await sql`SELECT * FROM ${sql.unsafe(table)} WHERE id = ${id} AND pet_id = ${petId}`
      if (!rows[0]) notFound('Recurso no encontrado')
      return fromRow(rows[0])
    },
    async create(petId, data) {
      const rows = await insert(petId, data)
      return fromRow(rows[0])
    },
    async update(petId, id, data) {
      await this.getById(petId, id)
      const rows = await updateSql(id, data)
      return fromRow(rows[0])
    },
    async delete(petId, id) {
      await this.getById(petId, id)
      await sql`DELETE FROM ${sql.unsafe(table)} WHERE id = ${id}`
    },
  }
}
