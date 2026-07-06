// pituti-api/app/api/pets/[petId]/medications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapMedication } from '@/lib/mappers/medication';

const CreateMedicationSchema = z.object({
  name:      z.string().min(1).max(100),
  // FIX: dosage e frequency eram min(1) — falham com string vazia
  dosage:    z.string().max(100).optional().nullable(),
  frequency: z.string().max(100).optional().nullable(),
  // FIX: startDate nullable — usa hoje como fallback (DB era NOT NULL)
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes:     z.string().max(500).nullish(),
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

    const rows = await query(
      `SELECT * FROM medications WHERE pet_id = $1 ORDER BY created_at DESC`,
      [petId],
    );
    return NextResponse.json({ data: rows.map(mapMedication), total: rows.length });
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
    const result = CreateMedicationSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { name, dosage, frequency, startDate, endDate, notes } = result.data;

    // FIX: start_date era NOT NULL — usa hoje como fallback
    const startDateValue = startDate ?? new Date().toISOString().slice(0, 10);

    const [row] = await query(
      `INSERT INTO medications (pet_id, name, dosage, frequency, start_date, end_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [petId, name, dosage ?? null, frequency ?? null, startDateValue, endDate ?? null, notes ?? null],
    );
    return NextResponse.json({ data: mapMedication(row) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}
