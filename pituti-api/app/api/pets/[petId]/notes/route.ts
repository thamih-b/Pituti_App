import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapNote } from '@/lib/mappers/note';

const CreateNoteSchema = z.object({
  content: z.string().min(1).max(2000),
  veterinary: z.string().max(100).nullish(),
  type: z
    .enum(['control', 'observacao', 'emergencia', 'vacuna', 'cirugia', 'otro'])
    .default('observacao'),
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
         content,
         veterinary,
         type,
         created_at
       FROM notes
       WHERE pet_id = $1
       ORDER BY created_at DESC`,
      [petId]
    );

    return NextResponse.json({
      data: rows.map(mapNote),
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
    const result = CreateNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { content, veterinary, type } = result.data;

    const [row] = await query(
      `INSERT INTO notes (
         pet_id,
         content,
         veterinary,
         type
       )
       VALUES ($1, $2, $3, $4)
       RETURNING
         id,
         pet_id,
         content,
         veterinary,
         type,
         created_at`,
      [
        petId,
        content,
        veterinary ?? null,
        type,
      ]
    );

    return NextResponse.json(
      { data: mapNote(row) },
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