import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const CreatePetSchema = z.object({
  owner_id: z.string().min(1),
  name: z.string().min(1).max(60),
  species: z.enum(['cat', 'dog', 'bird', 'rabbit', 'reptile', 'fish', 'other']),
  breed: z.string().max(80).optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  photo_url: z.url().optional().nullable(),
  color: z.string().max(60).optional(),
  microchip: z.string().max(20).optional(),
  passport: z.string().max(60).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const pets = ownerId
      ? await query('SELECT * FROM pets WHERE owner_id = $1 ORDER BY created_at ASC', [ownerId])
      : await query('SELECT * FROM pets ORDER BY created_at ASC');
    return NextResponse.json({ data: pets, total: pets.length });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreatePetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }
    const { owner_id, name, species, breed, birth_date, photo_url, color, microchip, passport } = result.data;
    const [pet] = await query(
      `INSERT INTO pets (owner_id, name, species, breed, birth_date, photo_url, color, microchip, passport)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [owner_id, name, species, breed, birth_date, photo_url, color, microchip, passport]
    );
    return NextResponse.json({ data: pet }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}