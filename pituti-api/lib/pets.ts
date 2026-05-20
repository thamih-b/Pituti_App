import { query } from '@/lib/db';

export async function findOwnedPetById(petId: string, userId: string) {
  const [pet] = await query(
    `SELECT
      id,
      name,
      species,
      breed,
      birth_date,
      photo_url,
      color,
      microchip,
      passport,
      owner_id,
      created_at
     FROM pets
     WHERE id = $1 AND owner_id = $2`,
    [petId, userId]
  );

  return pet ?? null;
}