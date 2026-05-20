import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapMedication } from '@/lib/mappers/medication';

const CreateMedicationSchema = z.object({
  name: z.string().min(1).max(100),
  dosage: z.string().min(1).max(100),
  frequency: z.string().min(1).max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  notes: z.string().max(500).nullish(),
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
      `SELECT id, pet_id, name, dosage, frequency, start_date, end_date, notes, created_at
       FROM medications
       WHERE pet_id = $1
       ORDER BY created_at DESC`,
      [petId]
    );

    return NextResponse.json({
      data: rows.map(mapMedication),
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
    const result = CreateMedicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { name, dosage, frequency, startDate, endDate, notes } = result.data;

    const [row] = await query(
      `INSERT INTO medications (
        pet_id,
        name,
        dosage,
        frequency,
        start_date,
        end_date,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, pet_id, name, dosage, frequency, start_date, end_date, notes, created_at`,
      [
        petId,
        name,
        dosage,
        frequency,
        startDate ?? null,
        endDate ?? null,
        notes ?? null,
      ]
    );

    return NextResponse.json(
      { data: mapMedication(row) },
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