import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { mapAppointment } from '@/lib/mappers/appointment';

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ vetId: string; id: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId, id } = await params;
    const vetRows = await query('SELECT id FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (vetRows.length === 0) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    const [row] = await query('SELECT * FROM appointments WHERE id = $1 AND vet_id = $2', [id, vetId]);
    if (!row) return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    return NextResponse.json({ data: mapAppointment(row) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ vetId: string; id: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId, id } = await params;
    const vetRows = await query('SELECT id FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (vetRows.length === 0) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    const body = await request.json();
    const result = UpdateAppointmentSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const fields = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });

    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([, v]) => v);
    const [row] = await query(
      `UPDATE appointments SET ${setClause} WHERE id = $${fields.length + 1} AND vet_id = $${fields.length + 2} RETURNING *`,
      [...values, id, vetId]
    );
    if (!row) return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    return NextResponse.json({ data: mapAppointment(row) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ vetId: string; id: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId, id } = await params;
    const vetRows = await query('SELECT id FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (vetRows.length === 0) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    const [row] = await query('DELETE FROM appointments WHERE id = $1 AND vet_id = $2 RETURNING id', [id, vetId]);
    if (!row) return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}