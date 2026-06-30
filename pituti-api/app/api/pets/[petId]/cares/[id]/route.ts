import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapCare } from '@/lib/mappers/care';

const UpdateCareSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.string().max(50).optional(),
  frequency: z.number().int().positive().optional().nullable(),
  periodType: z.enum(['day', 'week', 'month']).optional().nullable(),
  time: z.string().nullish(),
  notes: z.string().max(500).nullish(),
  status: z.enum(['pending', 'done', 'skipped']).optional(),
});

// GET /api/pets/:petId/cares/:id — busca um cuidado específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const [row] = await query(
      `SELECT id, pet_id, name, type, frequency, period_type, time, notes, status, created_at
       FROM cares
       WHERE id = $1 AND pet_id = $2`,
      [id, petId]
    );
    if (!row) return NextResponse.json({ error: 'Cuidado não encontrado' }, { status: 404 });

    return NextResponse.json({ data: mapCare(row) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

// PATCH /api/pets/:petId/cares/:id — actualiza um cuidado
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body = await request.json();
    const result = UpdateCareSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const fields = Object.entries(result.data).filter(([, value]) => value !== undefined);
    if (fields.length === 0) return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });

    const columnMap: Record<string, string> = {
      name: 'name',
      type: 'type',
      frequency: 'frequency',
      periodType: 'period_type',
      time: 'time',
      notes: 'notes',
      status: 'status',
    };

    const setClause = fields.map(([key], index) => `${columnMap[key]} = $${index + 1}`).join(', ');
    const values = fields.map(([, value]) => value);

    const [row] = await query(
      `UPDATE cares
       SET ${setClause}
       WHERE id = $${fields.length + 1} AND pet_id = $${fields.length + 2}
       RETURNING id, pet_id, name, type, frequency, period_type, time, notes, status, created_at`,
      [...values, id, petId]
    );
    if (!row) return NextResponse.json({ error: 'Cuidado não encontrado' }, { status: 404 });

    return NextResponse.json({ data: mapCare(row) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

// DELETE /api/pets/:petId/cares/:id — elimina um cuidado
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const [row] = await query(
      'DELETE FROM cares WHERE id = $1 AND pet_id = $2 RETURNING id',
      [id, petId]
    );
    if (!row) return NextResponse.json({ error: 'Cuidado não encontrado' }, { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}
