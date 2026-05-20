import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
email: z.string().check(z.email()),
photo_url: z.string().check(z.url()).optional().nullable(),
});

export async function GET() {
  try {
    const users = await query('SELECT id, name, email, photo_url, created_at FROM users ORDER BY created_at DESC');
    return NextResponse.json({ data: users, total: users.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { name, email, photo_url } = result.data;
    const [user] = await query(
      'INSERT INTO users (name, email, photo_url) VALUES ($1, $2, $3) RETURNING id, name, email, photo_url, created_at',
      [name, email, photo_url]
    );
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('unique')) {
      return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}