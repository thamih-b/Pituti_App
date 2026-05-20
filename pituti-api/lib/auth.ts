// lib/auth.ts
import { NextRequest } from "next/server";

export class AuthError extends Error {
  status = 401;
  constructor(message = "Não autenticado") {
    super(message);
    this.name = "AuthError";
  }
}

export type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: "user" | "admin";
};

export type AuthContext = {
  userId: string;
  user: AuthUser;
};

async function getUserById(userId: string): Promise<AuthUser | null> {
  // depois trocar por PostgreSQL/repository
  return null;
}

export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AuthError("Token ausente");
  }

  const user = await getUserById(token);

  if (!user) {
    throw new AuthError("Usuário inválido");
  }

  return { userId: user.id, user };
}

export async function optionalAuth(req: NextRequest): Promise<AuthContext | null> {
  try {
    return await requireAuth(req);
  } catch {
    return null;
  }
}