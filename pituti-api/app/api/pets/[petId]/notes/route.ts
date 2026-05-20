import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateNoteSchema = z.object({
  content: z.string().min(1).max(2000),
  veterinary: z.string().max(100).optional().nullable(),
  type: z.enum(['control', 'observacao', 'emergencia', 'vacuna', 'cirugia', 'otro']).optional().default('observacao'),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const rows = await query('SELECT * FROM notes WHERE pet_id = $1 ORDER BY created_at DESC', [petId]);
    return NextResponse.json({ data: rows, total: rows.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = CreateNoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { content, veterinary, type } = result.data;
    const [row] = await query(
      `INSERT INTO notes (pet_id, content, veterinary, type) VALUES ($1, $2, $3, $4) RETURNING *`,
      [petId, content, veterinary, type]
    );
    return NextResponse.json({ data: row }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}