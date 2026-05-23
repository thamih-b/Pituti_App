import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { findOwnedPetById } from '@/lib/pets';
import { mapPet } from '@/lib/mappers/pet';

const UpdatePetSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  species: z.enum(['cat', 'dog', 'bird', 'rabbit', 'reptile', 'fish', 'other']).optional(),
  breed: z.string().max(80).optional().nullable(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  color: z.string().max(60).optional().nullable(),
  microchip: z.string().max(20).optional().nullable(),
  passport: z.string().max(60).optional().nullable(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    return NextResponse.json({ data: mapPet(pet) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const existingPet = await findOwnedPetById(petId, auth.userId);
    if (!existingPet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });

    const body = await request.json();
    const result = UpdatePetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const fields = Object.entries(result.data).filter(([, v]) => v !== undefined);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar' }, { status: 400 });
    }

    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([, v]) => v);
    const [pet] = await query(
      `UPDATE pets
       SET ${setClause}
       WHERE id = $${fields.length + 1} AND owner_id = $${fields.length + 2}
       RETURNING *`,
      [...values, petId, auth.userId]
    );

    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    return NextResponse.json({ data: mapPet(pet) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const auth = await requireAuth(request);
    const { petId } = await params;
    const [pet] = await query(
      'DELETE FROM pets WHERE id = $1 AND owner_id = $2 RETURNING id',
      [petId, auth.userId]
    );
    if (!pet) return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Erro interno' }, { status });
  }
}