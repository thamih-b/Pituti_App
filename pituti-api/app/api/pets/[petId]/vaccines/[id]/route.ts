import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth';
import { findOwnedPetById } from '@/lib/pets';
import { mapVaccine } from '@/lib/mappers/vaccine';

const UpdateVaccineSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  veterinary: z.string().max(100).nullish(),
  notes: z.string().max(500).nullish(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) {
      return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    }

    const [row] = await query(
      `SELECT
         id,
         pet_id,
         name,
         date,
         next_due_date,
         veterinary,
         notes,
         created_at
       FROM vaccines
       WHERE id = $1 AND pet_id = $2`,
      [id, petId]
    );

    if (!row) {
      return NextResponse.json({ error: 'Vacuna não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ data: mapVaccine(row) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) {
      return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    }

    const body = await request.json();
    const result = UpdateVaccineSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const fields = Object.entries(result.data).filter(([, value]) => value !== undefined);

    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para actualizar' },
        { status: 400 }
      );
    }

    const columnMap: Record<string, string> = {
      name: 'name',
      date: 'date',
      nextDueDate: 'next_due_date',
      veterinary: 'veterinary',
      notes: 'notes',
    };

    const setClause = fields
      .map(([key], index) => `${columnMap[key]} = $${index + 1}`)
      .join(', ');

    const values = fields.map(([, value]) => value);

    const [row] = await query(
      `UPDATE vaccines
       SET ${setClause}
       WHERE id = $${fields.length + 1} AND pet_id = $${fields.length + 2}
       RETURNING
         id,
         pet_id,
         name,
         date,
         next_due_date,
         veterinary,
         notes,
         created_at`,
      [...values, id, petId]
    );

    if (!row) {
      return NextResponse.json({ error: 'Vacuna não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ data: mapVaccine(row) });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string; id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    const { petId, id } = await params;

    const pet = await findOwnedPetById(petId, auth.userId);
    if (!pet) {
      return NextResponse.json({ error: 'Mascota não encontrada' }, { status: 404 });
    }

    const [row] = await query(
      'DELETE FROM vaccines WHERE id = $1 AND pet_id = $2 RETURNING id',
      [id, petId]
    );

    if (!row) {
      return NextResponse.json({ error: 'Vacuna não encontrada' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}