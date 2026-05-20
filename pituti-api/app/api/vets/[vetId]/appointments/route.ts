import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateAppointmentSchema = z.object({
  pet_id: z.string().min(1),
  vet_name: z.string().min(1).max(100),
  clinic: z.string().max(100).optional().nullable(),
  type: z.enum(['routine', 'emergency', 'specialist', 'followup', 'exam', 'vaccine', 'other']).optional().default('routine'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1).max(300),
  diagnosis: z.string().max(500).optional().nullable(),
  treatment: z.string().max(500).optional().nullable(),
  next_appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  next_appointment_note: z.string().max(300).optional().nullable(),
  weight_kg: z.number().positive().optional().nullable(),
  cost: z.number().nonnegative().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const { vetId } = await params;
    const rows = await query(
      'SELECT * FROM appointments WHERE vet_id = $1 ORDER BY date DESC',
      [vetId]
    );
    return NextResponse.json({ data: rows, total: rows.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const { vetId } = await params;
    const body = await request.json();
    const result = CreateAppointmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const {
      pet_id, vet_name, clinic, type, date, reason, diagnosis,
      treatment, next_appointment_date, next_appointment_note,
      weight_kg, cost, notes,
    } = result.data;

    const [row] = await query(
      `INSERT INTO appointments
        (pet_id, vet_id, vet_name, clinic, type, date, reason, diagnosis, treatment,
         next_appointment_date, next_appointment_note, weight_kg, cost, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [pet_id, vetId, vet_name, clinic, type, date, reason, diagnosis,
       treatment, next_appointment_date, next_appointment_note, weight_kg, cost, notes]
    );
    return NextResponse.json({ data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}