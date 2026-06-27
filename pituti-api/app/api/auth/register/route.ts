import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Password deve ter pelo menos 8 caracteres').max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          error: firstError?.message ?? 'Dados inválidos',
          errors: parsed.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await query<{ id: string; name: string; email: string }>(
      'INSERT INTO users (name, email, passwordhash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), normalizedEmail, passwordHash]
    );

    if (!user) {
      return NextResponse.json({ error: 'Erro ao criar utilizador' }, { status: 500 });
    }

    const token = await signToken(user);

    return NextResponse.json(
      { data: { id: user.id, name: user.name, email: user.email }, token },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[register]', err);
    const msg: string = err?.message ?? '';
    if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate')) {
      return NextResponse.json({ error: 'Email já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
