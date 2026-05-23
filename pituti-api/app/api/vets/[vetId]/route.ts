import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { mapVet } from '@/lib/mappers/vet';

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

const UpdateVetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  clinic: z.string().min(1).max(100).optional(),
  type: z.enum(['primary', 'specialist', 'emergency', 'other']).optional(),
  specialty: z.string().max(100).optional().nullable(),
  phone: z.string().min(1).max(30).optional(),
  phone2: z.string().max(30).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  petIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId } = await params;
    const [vet] = await query<VetRow>('SELECT * FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (!vet) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    const petRows = await query<{ id: string; name: string; species: string; breed: string | null; birth_date: string | null; photo_url: string | null }>(
      `SELECT p.id, p.name, p.species, p.breed, p.birth_date, p.photo_url
       FROM vet_pets vp
       JOIN pets p ON p.id = vp.pet_id
       JOIN vets v ON v.id = vp.vet_id
       WHERE vp.vet_id = $1 AND v.owner_id = $2
       ORDER BY p.created_at DESC`,
      [vetId, auth.userId]
    );

    return NextResponse.json({ data: { ...mapVet(vet), pet_ids: petRows.map(p => p.id) } });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId } = await params;

    const body = await request.json();
    const result = UpdateVetSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ errors: result.error.issues }, { status: 400 });

    const { petIds, ...rest } = result.data;
    const fields = Object.entries(rest).filter(([, v]) => v !== undefined);
    if (fields.length === 0 && petIds === undefined) return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });

    const [existing] = await query<VetRow>('SELECT * FROM vets WHERE id = $1 AND owner_id = $2', [vetId, auth.userId]);
    if (!existing) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });

    let vet = existing;
    if (fields.length > 0) {
      const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
      const values = fields.map(([, v]) => v);
      const [updated] = await query<VetRow>(
        `UPDATE vets SET ${setClause} WHERE id = $${fields.length + 1} AND owner_id = $${fields.length + 2} RETURNING *`,
        [...values, vetId, auth.userId]
      );
      if (!updated) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });
      vet = updated;
    }

    if (petIds !== undefined) {
      await query('DELETE FROM vet_pets WHERE vet_id = $1', [vetId]);
      for (const petId of petIds) {
        const [pet] = await query<{ id: string }>('SELECT id FROM pets WHERE id = $1 AND owner_id = $2', [petId, auth.userId]);
        if (pet) {
          await query('INSERT INTO vet_pets (vet_id, pet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [vetId, petId]);
        }
      }
    }

    const currentPetIds = await query<{ pet_id: string }>('SELECT pet_id FROM vet_pets WHERE vet_id = $1', [vetId]);
    return NextResponse.json({ data: { ...mapVet(vet), pet_ids: currentPetIds.map(r => r.pet_id) } });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { vetId } = await params;
    const [vet] = await query('DELETE FROM vets WHERE id = $1 AND owner_id = $2 RETURNING id', [vetId, auth.userId]);
    if (!vet) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}