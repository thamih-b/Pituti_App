import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapCare } from '@/lib/mappers/care';

// FIX: frequency aceita number OU string (schema real é VARCHAR)
// FIX: periodType aceita os valores antigos ('daily','weekly') e novos ('day','week','month')
const CreateCareSchema = z.object({
  name:       z.string().min(1).max(100),
  type:       z.string().min(1).max(50),
  frequency:  z.union([z.number().int().positive(), z.string()]).optional().nullable(),
  periodType: z.string().optional().nullable(),
  time:       z.string().nullish(),
  notes:      z.string().max(500).nullish(),
  status:     z.enum(['pending', 'done', 'skipped']).default('pending'),
});

// Detecta se colunas 'time' e 'status' já existem (após migration V2)
async function caresHasNewColumns(): Promise<boolean> {
  try {
    const rows = await query<{ column_name: string }>(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_name = 'cares' AND column_name IN ('time', 'status')`
    );
    return rows.length >= 2;
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    // SELECT * para funcionar com qualquer versão do schema
    const rows = await query(
      `SELECT * FROM cares WHERE pet_id = $1 ORDER BY created_at DESC`,
      [petId]
    );

    return NextResponse.json({ data: rows.map(mapCare), total: rows.length });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body = await request.json();
    const result = CreateCareSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { name, type, frequency, periodType, time, notes, status } = result.data;

    // frequency pode chegar como number ou string — guarda como string para compatibilidade
    const freqValue = frequency != null ? String(frequency) : null;

    const hasNewCols = await caresHasNewColumns();

    let row: any;
    if (hasNewCols) {
      // Schema pós-migration: tem time e status
      [row] = await query(
        `INSERT INTO cares (pet_id, name, type, frequency, period_type, time, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [petId, name, type, freqValue, periodType ?? null, time ?? null, notes ?? null, status]
      );
    } else {
      // Schema original: sem time nem status
      [row] = await query(
        `INSERT INTO cares (pet_id, name, type, frequency, period_type, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [petId, name, type, freqValue, periodType ?? null, notes ?? null]
      );
    }

    return NextResponse.json({ data: mapCare(row) }, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}
