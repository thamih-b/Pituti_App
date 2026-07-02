import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { mapUser } from '@/lib/mappers/user';

const UpdateUserSchema = z.object({
  name:      z.string().min(1).max(100).optional(),
  email:     z.string().email().optional(),
  // FIX: aceita tanto camelCase (frontend) como snake_case (schema)
  // FIX: aceita data URIs (base64 fotos) além de URLs normais
  photo_url: z.string().optional().nullable(),
  photoUrl:  z.string().optional().nullable(),
  // FIX: novos campos de perfil
  phone:     z.string().max(30).optional().nullable(),
  city:      z.string().max(100).optional().nullable(),
  bio:       z.string().max(500).optional().nullable(),
});

// Colunas reais no DB — map de campo recebido → coluna SQL
const FIELD_TO_COLUMN: Record<string, string> = {
  name:      'name',
  email:     'email',
  photo_url: 'photo_url',
  photoUrl:  'photo_url',  // alias camelCase
  phone:     'phone',
  city:      'city',
  bio:       'bio',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    if (id !== auth.userId)
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const [user] = await query(
      'SELECT id, name, email, photo_url, phone, city, bio, created_at FROM users WHERE id = $1',
      [id]
    );
    if (!user) return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    return NextResponse.json({ data: mapUser(user) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    if (id !== auth.userId)
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const body = await request.json();
    const result = UpdateUserSchema.safeParse(body);
    if (!result.success)
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const data = result.data;

    // Normaliza: se veio photoUrl (camelCase), usa como photo_url
    if (data.photoUrl !== undefined && data.photo_url === undefined) {
      data.photo_url = data.photoUrl;
    }
    delete (data as any).photoUrl;

    // Constrói SET clause apenas com campos presentes
    const fields = Object.entries(data)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => ({ col: FIELD_TO_COLUMN[k] ?? k, val: v }))
      // remove duplicatas (caso photo_url venha de dois lugares)
      .filter((f, i, arr) => arr.findIndex(x => x.col === f.col) === i);

    if (fields.length === 0)
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });

    const setClause = fields.map((f, i) => `${f.col} = $${i + 1}`).join(', ');
    const values    = fields.map(f => f.val);

    const [user] = await query(
      `UPDATE users
       SET ${setClause}
       WHERE id = $${fields.length + 1}
       RETURNING id, name, email, photo_url, phone, city, bio, created_at`,
      [...values, id]
    );
    if (!user)
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });

    return NextResponse.json({ data: mapUser(user) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    if (id !== auth.userId)
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const [user] = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (!user)
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}
