import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const UpdatePetSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  species: z.enum(['cat', 'dog', 'bird', 'rabbit', 'reptile', 'fish', 'other']).optional(),
  breed: z.string().max(80).optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  photo_url: z.url().optional().nullable(),
  color: z.string().max(60).optional(),
  microchip: z.string().max(20).optional(),
  passport: z.string().max(60).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const [pet] = await query('SELECT * FROM pets WHERE id = $1', [petId]);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    return NextResponse.json({ data: pet });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = UpdatePetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const fields = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }
    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([, v]) => v);
    const [pet] = await query(
      `UPDATE pets SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, petId]
    );
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    return NextResponse.json({ data: pet });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const [pet] = await query('DELETE FROM pets WHERE id = $1 RETURNING id', [petId]);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}