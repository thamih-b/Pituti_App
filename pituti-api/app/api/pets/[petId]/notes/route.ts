// pituti-api/app/api/pets/[petId]/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapNote } from '@/lib/mappers/note';

const CreateNoteSchema = z.object({
  content: z.string().min(1).max(2000),
  type:    z.enum(['control', 'observacao', 'emergencia', 'vacuna', 'cirugia', 'otro']).default('observacao'),
  // FIX: aceita tanto 'veterinary' como 'vet' (frontend envia 'vet')
  veterinary: z.string().max(100).nullish(),
  vet:        z.string().max(100).nullish(),
  // FIX: date não existia no schema original — nullable
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    // SELECT * — mapNote lida com 'veterinary' e 'vet' e 'date'
    const rows = await query(
      `SELECT * FROM notes WHERE pet_id = $1 ORDER BY created_at DESC`,
      [petId],
    );
    return NextResponse.json({ data: rows.map(mapNote), total: rows.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body   = await request.json();
    const result = CreateNoteSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { content, type, veterinary, vet, date } = result.data;
    // Aceita veterinary OU vet (frontend antigo envia 'vet')
    const vetValue = veterinary ?? vet ?? null;

    // Tenta INSERT com date (após migration). Se falhar, tenta sem date.
    let row: any;
    try {
      [row] = await query(
        `INSERT INTO notes (pet_id, content, veterinary, type, date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [petId, content, vetValue, type, date ?? null],
      );
    } catch {
      // Fallback: schema original sem date
      [row] = await query(
        `INSERT INTO notes (pet_id, content, veterinary, type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [petId, content, vetValue, type],
      );
    }
    return NextResponse.json({ data: mapNote(row) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}
