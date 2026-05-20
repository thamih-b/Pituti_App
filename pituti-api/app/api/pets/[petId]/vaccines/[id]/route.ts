import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const UpdateVaccineSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  next_due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  veterinary: z.string().max(100).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string; id: string }> }) {
  try {
    const { petId, id } = await params;
    const [row] = await query('SELECT * FROM vaccines WHERE id = $1 AND pet_id = $2', [id, petId]);
    if (!row) return NextResponse.json({ error: 'Vacina não encontrada' }, { status: 404 });
    return NextResponse.json({ data: row });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ petId: string; id: string }> }) {
  try {
    const { petId, id } = await params;
    const body = await request.json();
    const result = UpdateVaccineSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const fields = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }
    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([, v]) => v);
    const [row] = await query(
      `UPDATE vaccines SET ${setClause} WHERE id = $${fields.length + 1} AND pet_id = $${fields.length + 2} RETURNING *`,
      [...values, id, petId]
    );
    if (!row) return NextResponse.json({ error: 'Vacina não encontrada' }, { status: 404 });
    return NextResponse.json({ data: row });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ petId: string; id: string }> }) {
  try {
    const { petId, id } = await params;
    const [row] = await query('DELETE FROM vaccines WHERE id = $1 AND pet_id = $2 RETURNING id', [id, petId]);
    if (!row) return NextResponse.json({ error: 'Vacina não encontrada' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}