// lib/db.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// FIX (500 em todas as rotas de sub-recursos): o driver @neondatabase/serverless
// deixou de aceitar `sql(texto, params)` como chamada de função normal — só
// funciona como template literal (sql`SELECT ${valor}`) OU via `sql.query(...)`.
// Chamar `sql(texto, params)` agora lança:
//   "This function can now be called only as a tagged-template function..."
// o que rebentava com TODAS as rotas que passam por este helper (cares,
// medications, symptoms, notes, vaccines, appointments) — exceto as que não
// usam este `query()` central (pets, users), por isso é que só essas
// funcionavam entre aparelhos.
export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const rows = await sql.query(text, params ?? []);
  return rows as T[];
}