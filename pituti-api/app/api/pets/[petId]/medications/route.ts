import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateMedicationSchema = z.object({
  name: z.string().min(1).max(100),
  dosage: z.string().min(1).max(100),
  frequency: z.string().min(1).max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const rows = await query('SELECT * FROM medications WHERE pet_id = $1 ORDER BY created_at DESC', [petId]);
    return NextResponse.json({ data: rows, total: rows.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = CreateMedicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { name, dosage, frequency, start_date, end_date, notes } = result.data;
    const [row] = await query(
      `INSERT INTO medications (pet_id, name, dosage, frequency, start_date, end_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [petId, name, dosage, frequency, start_date, end_date, notes]
    );
    return NextResponse.json({ data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}