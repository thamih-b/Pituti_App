import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';


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
  pet_ids: z.array(z.string()).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const { vetId } = await params;

    const vets = await query<VetRow>(
      'SELECT * FROM vets WHERE id = $1',
      [vetId]
    );

    const vet = vets[0];
    if (!vet) {
      return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });
    }

    const petRows = await query<{
      id: string;
      name: string;
      species: string;
      breed: string | null;
      birth_date: string | null;
      photo_url: string | null;
    }>(
      `SELECT p.id, p.name, p.species, p.breed, p.birth_date, p.photo_url
       FROM vet_pets vp
       JOIN pets p ON p.id = vp.pet_id
       WHERE vp.vet_id = $1
       ORDER BY p.created_at DESC`,
      [vetId]
    );

    return NextResponse.json({
      data: {
        ...vet,
        pets: petRows,
      },
    });
  } catch (error) {
    console.error('GET /api/vets/:vetId error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const { vetId } = await params;
    const body = await request.json();
    const result = UpdateVetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { pet_ids, ...rest } = result.data;
    const fields = Object.entries(rest).filter(([, v]) => v !== undefined);

    let vet;
    if (fields.length > 0) {
      const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
      const values = fields.map(([, v]) => v);
      const [updated] = await query(
        `UPDATE vets SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, vetId]
      );
      if (!updated) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });
      vet = updated;
    } else {
      const [existing] = await query('SELECT * FROM vets WHERE id = $1', [vetId]);
      if (!existing) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });
      vet = existing;
    }

    // Actualizar pet_ids se fornecido
    if (pet_ids !== undefined) {
      await query('DELETE FROM vet_pets WHERE vet_id = $1', [vetId]);
      for (const petId of pet_ids) {
        await query(
          'INSERT INTO vet_pets (vet_id, pet_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [vetId, petId]
        );
      }
    }

    const currentPetIds = await query<{ pet_id: string }>(
      'SELECT pet_id FROM vet_pets WHERE vet_id = $1',
      [vetId]
    );

    return NextResponse.json({ data: { ...vet, pet_ids: currentPetIds.map(r => r.pet_id) } });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ vetId: string }> }) {
  try {
    const { vetId } = await params;
    const [vet] = await query('DELETE FROM vets WHERE id = $1 RETURNING id', [vetId]);
    if (!vet) return NextResponse.json({ error: 'Veterinário não encontrado' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}