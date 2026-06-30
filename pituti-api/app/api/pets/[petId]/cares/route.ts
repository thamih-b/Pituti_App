import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapCare } from '@/lib/mappers/care';

const CreateCareSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  frequency: z.number().int().positive().optional().nullable(),
  periodType: z.enum(['day', 'week', 'month']).optional().nullable(),
  time: z.string().nullish(),
  notes: z.string().max(500).nullish(),
  status: z.enum(['pending', 'done', 'skipped']).default('pending'),
});

// GET /api/pets/:petId/cares — lista todos os cuidados do pet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const rows = await query(
      `SELECT id, pet_id, name, type, frequency, period_type, time, notes, status, created_at
       FROM cares
       WHERE pet_id = $1
       ORDER BY created_at DESC`,
      [petId]
    );

    return NextResponse.json({ data: rows.map(mapCare), total: rows.length });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

// POST /api/pets/:petId/cares — cria um novo cuidado
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body = await request.json();
    const result = CreateCareSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { name, type, frequency, periodType, time, notes, status } = result.data;
    const [row] = await query(
      `INSERT INTO cares (
         pet_id, name, type, frequency, period_type, time, notes, status
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, pet_id, name, type, frequency, period_type, time, notes, status, created_at`,
      [petId, name, type, frequency ?? null, periodType ?? null, time ?? null, notes ?? null, status]
    );

    return NextResponse.json({ data: mapCare(row) }, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}
