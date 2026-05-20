export function mapPet(row: any) {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    birthDate: row.birth_date,
    photoUrl: row.photo_url,
    color: row.color,
    microchip: row.microchip,
    passport: row.passport,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}