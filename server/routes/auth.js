// server/routes/auth.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { neon } from '@neondatabase/serverless';

const router = Router();

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado');
  return neon(process.env.DATABASE_URL);
}

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');
}

async function signToken(user) {
  return new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password deve ter pelo menos 8 caracteres' });
    }

    const sql = getSql();

    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email já existe' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${email.toLowerCase()}, ${passwordHash})
      RETURNING id, name, email
    `;

    const token = await signToken(user);
    return res.status(201).json({ data: { user, token } });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }

    const sql = getSql();

    const rows = await sql`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ${email.toLowerCase()}
    `;
    const user = rows[0];

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = await signToken({ id: user.id, name: user.name, email: user.email });
    return res.json({
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
