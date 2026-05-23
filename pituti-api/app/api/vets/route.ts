import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { mapVet } from '@/lib/mappers/vet';

const CreateVetSchema = z.object({
  name: z.string().min(1, { message: 'Nome obrigatório' }).max(100),
  clinic: z.string().min(1, { message: 'Clínica obrigatória' }).max(100),
  phone: z.string().min(1, { message: 'Telefone obrigatório' }).max(30),
  type: z.enum(['primary', 'specialist', 'emergency', 'other']).optional().default('primary'),
  specialty: z.string().max(100).optional().nullable(),
  phone2: z.string().max(30).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  petIds: z.array(z.string()).optional().default([]),
});

type VetRow = {
  id: string;
  owner_id: string;
  name: string;
  clinic: string;
  phone: string;
  type: 'primary' | 'specialist' | 'emergency' | 'other';
  specialty: string | null;
  phone2: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
};

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const rows = await query<VetRow>('SELECT * FROM vets WHERE owner_id = $1 ORDER BY created_at DESC', [auth.userId]);
    return NextResponse.json({ data: rows.map(mapVet), total: rows.length });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();
    const result = CreateVetSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { name, clinic, phone, type, specialty, phone2, address, notes, petIds } = result.data;
    const [vet] = await query<VetRow>(
      `INSERT INTO vets (owner_id, name, clinic, phone, type, specialty, phone2, address, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [auth.userId, name, clinic, phone, type, specialty ?? null, phone2 ?? null, address ?? null, notes ?? null]
    );

    if (petIds.length > 0) {
      for (const petId of petIds) {
        await query('INSERT INTO vet_pets (vet_id, pet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [vet.id, petId]);
      }
    }

    const petRows = await query<{ pet_id: string }>('SELECT pet_id FROM vet_pets WHERE vet_id = $1', [vet.id]);
    return NextResponse.json({ data: { ...mapVet(vet), pet_ids: petRows.map(r => r.pet_id) } }, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}