import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateVaccineSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  next_due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  veterinary: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const rows = await query('SELECT * FROM vaccines WHERE pet_id = $1 ORDER BY date DESC', [petId]);
    return NextResponse.json({ data: rows, total: rows.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = CreateVaccineSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { name, date, next_due_date, veterinary, notes } = result.data;
const [row] = await query(
  `INSERT INTO vaccines (pet_id, name, date, next_due_date, veterinary, notes)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
  [petId, name, date, next_due_date, veterinary, notes]
);
    return NextResponse.json({ data: row }, { status: 201 });
} catch (e) {
  console.error('POST /api/pets/[petId]/vaccines error:', e);
  return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
}
}