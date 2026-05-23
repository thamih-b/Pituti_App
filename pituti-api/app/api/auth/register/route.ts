import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const existing = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await query<{ id: string; name: string; email: string }>(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );

    const token = await signToken(user);
    return NextResponse.json({ data: { user, token } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}