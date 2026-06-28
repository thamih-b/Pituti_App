import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

const registerSchema = z.object({
  name:     z.string().min(1).max(100),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const body   = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      // Devolve "error" (string) igual ao login — não "errors" (array)
      const firstError = parsed.error.issues[0]?.message ?? 'Dados inválidos';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await query<{ id: string; name: string; email: string }>(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), normalizedEmail, passwordHash]
    );

    const token = await signToken({ id: user.id, name: user.name, email: user.email });

    return NextResponse.json({ data: { user, token } }, { status: 201 });
  } catch (err: any) {
    // Unique constraint do Postgres → email duplicado numa race condition
    if (err?.code === '23505') {
      return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    }
    console.error('[register]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
