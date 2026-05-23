import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { mapUser } from '@/lib/mappers/user';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  photo_url: z.string().url().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const [user] = await query('SELECT id, name, email, photo_url, created_at FROM users WHERE id = $1', [auth.userId]);
    if (!user) return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 });
    return NextResponse.json({ data: mapUser(user) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = CreateUserSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { name, email, photo_url } = result.data;
    const [user] = await query('INSERT INTO users (name, email, photo_url) VALUES ($1, $2, $3) RETURNING id, name, email, photo_url, created_at', [name, email, photo_url]);
    return NextResponse.json({ data: mapUser(user) }, { status: 201 });
  } catch (error: any) {
    const msg = error?.message ?? '';
    if (msg.includes('unique')) return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}