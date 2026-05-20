import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const CreatePetSchema = z.object({
  name: z.string().min(1).max(60),
  species: z.enum(['cat', 'dog', 'bird', 'rabbit', 'reptile', 'fish', 'other']),
  breed: z.string().max(80).optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  photo_url: z.string().url().optional().nullable(),
  color: z.string().max(60).optional(),
  microchip: z.string().max(20).optional(),
  passport: z.string().max(60).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const pets = await query(
      `SELECT *
       FROM pets
       WHERE owner_id = $1
       ORDER BY created_at DESC`,
      [auth.userId]
    );

    return NextResponse.json({
      data: pets,
      total: pets.length,
    });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const body = await request.json();

    const result = CreatePetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { name, species, breed, birth_date, photo_url, color, microchip, passport } = result.data;

    const [pet] = await query(
      `INSERT INTO pets (
        name,
        species,
        breed,
        birth_date,
        photo_url,
        color,
        microchip,
        passport,
        owner_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        name,
        species,
        breed ?? null,
        birth_date ?? null,
        photo_url ?? null,
        color ?? null,
        microchip ?? null,
        passport ?? null,
        auth.userId,
      ]
    );

    return NextResponse.json({ data: pet }, { status: 201 });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json(
      { error: error?.message ?? 'Erro interno' },
      { status }
    );
  }
}