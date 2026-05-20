import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateSymptomSchema = z.object({
  description: z.string().min(1).max(300),
  severity: z.enum(['mild', 'moderate', 'severe']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional().nullable(),
  resolved: z.boolean().optional().default(false),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const rows = await query('SELECT * FROM symptoms WHERE pet_id = $1 ORDER BY date DESC', [petId]);
    return NextResponse.json({ data: rows, total: rows.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = CreateSymptomSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { description, severity, date, notes, resolved } = result.data;
    const [row] = await query(
      `INSERT INTO symptoms (pet_id, description, severity, date, notes, resolved)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [petId, description, severity, date, notes, resolved]
    );
    return NextResponse.json({ data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}