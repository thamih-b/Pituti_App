import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const MedicalProfileSchema = z.object({
  sex: z.enum(['male', 'female', 'unknown']).optional(),
  neutered: z.boolean().optional().nullable(),
  neutered_age: z.string().max(30).optional().nullable(),
  blood_type: z.string().max(10).optional().nullable(),
  allergies: z.array(z.string()).optional().default([]),
  conditions: z.array(z.object({
    name: z.string().min(1).max(100),
    notes: z.string().max(300).optional(),
  })).optional().default([]),
  surgeries: z.array(z.object({
    name: z.string().min(1).max(100),
    notes: z.string().max(300).optional(),
  })).optional().default([]),
  environment: z.enum(['apartment', 'house', 'both']).optional().nullable(),
  living_with_animals: z.boolean().optional().nullable(),
  behavioral_notes: z.string().max(1000).optional().nullable(),
  vet_questions: z.string().max(1000).optional().nullable(),
});

export async function GET(_: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const [profile] = await query(
      'SELECT * FROM medical_profiles WHERE pet_id = $1',
      [petId]
    );
    return NextResponse.json({ data: profile ?? null });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  try {
    const { petId } = await params;
    const body = await request.json();
    const result = MedicalProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const {
      sex,
      neutered,
      neutered_age,
      blood_type,
      allergies,
      conditions,
      surgeries,
      environment,
      living_with_animals,
      behavioral_notes,
      vet_questions,
    } = result.data;

    const [profile] = await query(
      `INSERT INTO medical_profiles
        (pet_id, sex, neutered, neutered_age, blood_type, allergies, conditions, surgeries,
         environment, living_with_animals, behavioral_notes, vet_questions, updated_at)
       VALUES (
         $1, $2, $3, $4, $5,
         $6::text[],
         $7::jsonb,
         $8::jsonb,
         $9, $10, $11, $12, NOW()
       )
       ON CONFLICT (pet_id) DO UPDATE SET
        sex = EXCLUDED.sex,
        neutered = EXCLUDED.neutered,
        neutered_age = EXCLUDED.neutered_age,
        blood_type = EXCLUDED.blood_type,
        allergies = EXCLUDED.allergies,
        conditions = EXCLUDED.conditions,
        surgeries = EXCLUDED.surgeries,
        environment = EXCLUDED.environment,
        living_with_animals = EXCLUDED.living_with_animals,
        behavioral_notes = EXCLUDED.behavioral_notes,
        vet_questions = EXCLUDED.vet_questions,
        updated_at = NOW()
       RETURNING *`,
      [
        petId,
        sex,
        neutered,
        neutered_age,
        blood_type,
        allergies,
        JSON.stringify(conditions),
        JSON.stringify(surgeries),
        environment,
        living_with_animals,
        behavioral_notes,
        vet_questions,
      ]
    );

    return NextResponse.json({ data: profile });
  } catch (e) {
    console.error('PUT /medical-profile error:', e);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}