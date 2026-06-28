import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { mapVaccine } from '@/lib/mappers/vaccine';
import { z } from 'zod';

const CreateVaccineSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  next_due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  veterinary: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    await requireAuth(request);
    const { petId } = await params;
    const rows = await query('SELECT * FROM vaccines WHERE pet_id = $1 ORDER BY vaccine_date DESC', [petId]);
    return NextResponse.json({ data: rows.map(mapVaccine), total: rows.length });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    await requireAuth(request);
    const { petId } = await params;
    const body = await request.json();
    const result = CreateVaccineSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { name, date: vaccine_date, next_due_date: next_dose_date, veterinary: veterinarian, notes } = result.data;
    const [row] = await query(
      `INSERT INTO vaccines (pet_id, name, vaccine_date, next_dose_date, veterinarian, notes)
 VALUES ($1, $2, $3, $4, $5, $6)
 RETURNING *`,
      [petId, name, vaccine_date, next_dose_date, veterinarian, notes]
    );

    return NextResponse.json({ data: mapVaccine(row) }, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}