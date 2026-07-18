// pituti-api/app/api/pets/[petId]/cares/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapCare } from '@/lib/mappers/care';

const CreateCareSchema = z.object({
  name:       z.string().min(1).max(100),
  type:       z.string().min(1).max(50),
  // frequency aceita number ou string (schema original é VARCHAR, novo é INTEGER)
  frequency:  z.union([z.number().int().positive(), z.string()]).optional().nullable(),
  periodType: z.string().optional().nullable(),
  // FIX (sync): intervalo customizado ("a cada X dias"), guardado quando periodType é null
  intervalDays: z.number().int().positive().optional().nullable(),
  time:       z.string().max(10).nullish(),
  notes:      z.string().max(500).nullish(),
  status:     z.enum(['pending', 'done', 'skipped']).default('pending'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    // SELECT * — mapCare lida com frequency VARCHAR e INTEGER
    const rows = await query(
      `SELECT * FROM cares WHERE pet_id = $1 ORDER BY created_at DESC`,
      [petId],
    );

    return NextResponse.json({ data: rows.map(mapCare), total: rows.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body   = await request.json();
    const result = CreateCareSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { name, type, frequency, periodType, intervalDays, time, notes, status } = result.data;

    // Guarda frequency como texto — se a coluna for VARCHAR recebe string,
    // se for INTEGER recebe número. CAST dinâmico evita erros de tipo.
    const freqValue = frequency != null ? String(frequency) : null;

    // time, status e interval_days: inseridos com fallback — se a(s) coluna(s)
    // não existirem ainda (antes das migrations), o INSERT completo falha e
    // tentamos o INSERT com o conjunto anterior de colunas.
    // Para compatibilidade: tentamos INSERT com todas as colunas.
    // Se falhar por coluna inexistente, INSERT com colunas originais.
    let row: any;
    try {
      [row] = await query(
        `INSERT INTO cares (pet_id, name, type, frequency, period_type, interval_days, time, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [petId, name, type, freqValue, periodType ?? null, intervalDays ?? null, time ?? null, notes ?? null, status],
      );
    } catch {
      try {
        // Fallback: schema sem interval_days (antes da migration 002)
        [row] = await query(
          `INSERT INTO cares (pet_id, name, type, frequency, period_type, time, notes, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [petId, name, type, freqValue, periodType ?? null, time ?? null, notes ?? null, status],
        );
      } catch {
        // Fallback: schema original (sem time e status)
        [row] = await query(
          `INSERT INTO cares (pet_id, name, type, frequency, period_type, notes)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [petId, name, type, freqValue, periodType ?? null, notes ?? null],
        );
      }
    }

    return NextResponse.json({ data: mapCare(row) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status: error?.status ?? 500 });
  }
}