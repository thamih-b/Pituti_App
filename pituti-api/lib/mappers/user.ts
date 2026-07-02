// lib/mappers/user.ts
export function mapUser(row: any) {
  return {
    id:        row.id,
    name:      row.name,
    email:     row.email,
    photoUrl:  row.photo_url  ?? null,
    phone:     row.phone      ?? '',
    city:      row.city       ?? '',
    bio:       row.bio        ?? '',
    createdAt: row.created_at,
  };
}
