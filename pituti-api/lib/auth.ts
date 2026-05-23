import { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me');

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthContext = {
  userId: string;
  user: AuthUser;
};

export class AuthError extends Error {
  status = 401;
  constructor(message = 'Não autenticado') {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signToken(payload: AuthUser) {
  return new SignJWT({ name: payload.name, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthContext> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.sub;
    if (!userId || typeof userId !== 'string') throw new Error('Invalid token');
    return {
      userId,
      user: {
        id: userId,
        name: typeof payload.name === 'string' ? payload.name : '',
        email: typeof payload.email === 'string' ? payload.email : '',
      },
    };
  } catch {
    throw new AuthError('Token inválido');
  }
}

export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) throw new AuthError('Token ausente');
  return verifyToken(token);
}