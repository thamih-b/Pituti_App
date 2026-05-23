import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { mapAppointment } from '@/lib/mappers/appointment';

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId } = await params;
    const vetRows = await query('SELECT id FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (vetRows.length === 0) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    const rows = await query('SELECT * FROM appointments WHERE vet_id = $1 ORDER BY date DESC', [vetId]);
    return NextResponse.json({ data: rows.map(mapAppointment), total: rows.length });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId } = await params;
    const vetRows = await query('SELECT id FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (vetRows.length === 0) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    const body = await request.json();
    const result = CreateAppointmentSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { pet_id, vet_name, clinic, type, date, reason, diagnosis, treatment, next_appointment_date, next_appointment_note, weight_kg, cost, notes } = result.data;
    const petRows = await query('SELECT id FROM pets WHERE id = $1 AND owner_id = $2', [pet_id, auth.userId]);
    if (petRows.length === 0) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const [row] = await query(
      `INSERT INTO appointments
        (pet_id, vet_id, vet_name, clinic, type, date, reason, diagnosis, treatment,
         next_appointment_date, next_appointment_note, weight_kg, cost, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [pet_id, vetId, vet_name, clinic, type, date, reason, diagnosis, treatment, next_appointment_date, next_appointment_note, weight_kg, cost, notes]
    );
    return NextResponse.json({ data: mapAppointment(row) }, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}