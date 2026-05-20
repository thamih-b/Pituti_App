import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateCareSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  frequency: z.number().int().positive().optional(),
  period_type: z.enum(['day', 'week', 'month']).optional(),
  time: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  status: z.enum(['pending', 'done', 'skipped']).optional().default('pending'),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const rows = await query('SELECT * FROM cares WHERE pet_id = $1 ORDER BY created_at DESC', [petId]);
    return NextResponse.json({ data: rows, total: rows.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = CreateCareSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { name, type, frequency, period_type, time, notes, status } = result.data;
    const [row] = await query(
      `INSERT INTO cares (pet_id, name, type, frequency, period_type, time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [petId, name, type, frequency, period_type, time, notes, status]
    );
    return NextResponse.json({ data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}