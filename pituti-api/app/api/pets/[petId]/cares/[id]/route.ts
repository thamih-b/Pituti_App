// pituti-api/app/api/pets/[petId]/cares/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapCare } from '@/lib/mappers/care';

const UpdateCareSchema = z.object({
  name:       z.string().min(1).max(100).optional(),
  type:       z.string().max(50).optional(),
  frequency:  z.union([z.number().int().positive(), z.string()]).optional().nullable(),
  periodType: z.string().optional().nullable(),
  // FIX (sync): intervalo customizado ("a cada X dias")
  intervalDays: z.number().int().positive().optional().nullable(),
  time:       z.string().max(10).nullish(),
  notes:      z.string().max(500).nullish(),
  status:     z.enum(['pending', 'done', 'skipped']).optional(),
  // FIX (sync): estado diário de conclusão { "YYYY-MM-DD": { done, doneState } }
  doneDates:  z.record(z.string(), z.object({ done: z.number(), doneState: z.boolean() })).optional(),
});

const COLUMN_MAP: Record<string, string> = {
  name:         'name',
  type:         'type',
  frequency:    'frequency',
  periodType:   'period_type',
  intervalDays: 'interval_days',
  time:         'time',
  notes:        'notes',
  status:       'status',
  doneDates:    'done_dates',
};

// Colunas cujo valor tem de ser serializado como JSON antes de ir para o Postgres (jsonb)
const JSON_COLUMNS = new Set(['doneDates']);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const [row] = await query(
      `SELECT * FROM cares WHERE id = $1 AND pet_id = $2`,
      [id, petId],
    );
    if (!row) return NextResponse.json({ error: 'Cuidado não encontrado' }, { status: 404 });
    return NextResponse.json({ data: mapCare(row) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body   = await request.json();
    const result = UpdateCareSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const entries = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (!entries.length) return NextResponse.json({ error: 'Nenhum campo' }, { status: 400 });

    const setClause = entries
      .map(([k], i) => `${COLUMN_MAP[k] ?? k} = $${i + 1}`)
      .join(', ');
    const values = entries.map(([k, v]) =>
      JSON_COLUMNS.has(k) ? JSON.stringify(v) : (typeof v === 'number' ? String(v) : v)
    );;

    const [row] = await query(
      `UPDATE cares SET ${setClause}
       WHERE id = $${entries.length + 1} AND pet_id = $${entries.length + 2}
       RETURNING *`,
      [...values, id, petId],
    );
    if (!row) return NextResponse.json({ error: 'Cuidado não encontrado' }, { status: 404 });
    return NextResponse.json({ data: mapCare(row) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const [row] = await query(
      'DELETE FROM cares WHERE id = $1 AND pet_id = $2 RETURNING id',
      [id, petId],
    );
    if (!row) return NextResponse.json({ error: 'Cuidado não encontrado' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}