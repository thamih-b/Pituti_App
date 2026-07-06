// pituti-api/app/api/pets/[petId]/symptoms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapSymptom } from '@/lib/mappers/symptom';

const CreateSymptomSchema = z.object({
  description: z.string().min(1).max(300),
  severity:    z.enum(['mild', 'moderate', 'severe']),
  // date é opcional — usa hoje como fallback
  date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes:   z.string().max(500).nullish(),
  resolved: z.boolean().default(false),
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

    // SELECT * é seguro — mapSymptom lida com nomes antigos e novos de colunas
    const rows = await query(
      `SELECT * FROM symptoms WHERE pet_id = $1 ORDER BY created_at DESC`,
      [petId],
    );

    return NextResponse.json({ data: rows.map(mapSymptom), total: rows.length });
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
    const result = CreateSymptomSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { description, severity, date, notes, resolved } = result.data;
    const dateValue = date ?? new Date().toISOString().slice(0, 10);

    // INSERT popula AMBAS as colunas (antigas e novas) para compatibilidade
    // com schemas antes e depois da migration.
    // observed_date tem DEFAULT CURRENT_TIMESTAMP → não precisa de valor.
    // symptom tem DEFAULT '' → usa description como fallback.
    const [row] = await query(
      `INSERT INTO symptoms (
         pet_id,
         symptom,
         description,
         severity,
         observed_date,
         date,
         notes,
         resolved
       )
       VALUES ($1, $2, $3, $4, $5::timestamptz, $6::date, $7, $8)
       RETURNING *`,
      [
        petId,
        description,         // symptom (coluna original, NOT NULL antes da migration)
        description,         // description (coluna nova, pode ser NULL antes da migration)
        severity,
        dateValue + 'T12:00:00Z', // observed_date (coluna original)
        dateValue,               // date (coluna nova)
        notes ?? null,
        resolved,
      ],
    );

    return NextResponse.json({ data: mapSymptom(row) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}
