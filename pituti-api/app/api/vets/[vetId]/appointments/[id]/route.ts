import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const UpdateAppointmentSchema = z.object({
  vet_name: z.string().min(1).max(100).optional(),
  clinic: z.string().max(100).optional().nullable(),
  type: z.enum(['routine', 'emergency', 'specialist', 'followup', 'exam', 'vaccine', 'other']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reason: z.string().min(1).max(300).optional(),
  diagnosis: z.string().max(500).optional().nullable(),
  treatment: z.string().max(500).optional().nullable(),
  next_appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  next_appointment_note: z.string().max(300).optional().nullable(),
  weight_kg: z.number().positive().optional().nullable(),
  cost: z.number().nonnegative().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ vetId: string; id: string }> }) {
  try {
    const { vetId, id } = await params;
    const [row] = await query(
      'SELECT * FROM appointments WHERE id = $1 AND vet_id = $2',
      [id, vetId]
    );
    if (!row) return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    return NextResponse.json({ data: row });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ vetId: string; id: string }> }) {
  try {
    const { vetId, id } = await params;
    const body = await request.json();
    const result = UpdateAppointmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const fields = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }
    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([, v]) => v);
    const [row] = await query(
      `UPDATE appointments SET ${setClause} WHERE id = $${fields.length + 1} AND vet_id = $${fields.length + 2} RETURNING *`,
      [...values, id, vetId]
    );
    if (!row) return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    return NextResponse.json({ data: row });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ vetId: string; id: string }> }) {
  try {
    const { vetId, id } = await params;
    const [row] = await query(
      'DELETE FROM appointments WHERE id = $1 AND vet_id = $2 RETURNING id',
      [id, vetId]
    );
    if (!row) return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}