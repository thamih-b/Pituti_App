import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
email: z.string().check(z.email()),
photo_url: z.string().check(z.url()).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [user] = await query(
      'SELECT id, name, email, photo_url, created_at FROM users WHERE id = $1',
      [id]
    );
    if (!user) return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    return NextResponse.json({ data: user });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = UpdateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const fields = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }
    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([, v]) => v);
    const [user] = await query(
      `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING id, name, email, photo_url, created_at`,
      [...values, id]
    );
    if (!user) return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    return NextResponse.json({ data: user });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [user] = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (!user) return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}