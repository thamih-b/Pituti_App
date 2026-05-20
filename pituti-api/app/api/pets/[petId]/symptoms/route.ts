import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapSymptom } from '@/lib/mappers/symptom';

const CreateSymptomSchema = z.object({
  description: z.string().min(1).max(300),
  severity: z.enum(['mild', 'moderate', 'severe']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).nullish(),
  resolved: z.boolean().default(false),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) {
      return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    }

    const rows = await query(
      `SELECT
         id,
         pet_id,
         description,
         severity,
         date,
         notes,
         resolved,
         created_at
       FROM symptoms
       WHERE pet_id = $1
       ORDER BY date DESC, created_at DESC`,
      [petId]
    );

    return NextResponse.json({
      data: rows.map(mapSymptom),
      total: rows.length,
    });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) {
      return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    }

    const body = await request.json();
    const result = CreateSymptomSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { description, severity, date, notes, resolved } = result.data;

    const [row] = await query(
      `INSERT INTO symptoms (
         pet_id,
         description,
         severity,
         date,
         notes,
         resolved
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
         id,
         pet_id,
         description,
         severity,
         date,
         notes,
         resolved,
         created_at`,
      [
        petId,
        description,
        severity,
        date,
        notes ?? null,
        resolved,
      ]
    );

    return NextResponse.json(
      { data: mapSymptom(row) },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}