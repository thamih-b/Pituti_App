import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.issues }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const [user] = await query<{ id: string; name: string; email: string; password_hash: string | null }>(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = await signToken({ id: user.id, name: user.name, email: user.email });
    return NextResponse.json({ data: { user: { id: user.id, name: user.name, email: user.email }, token } });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}