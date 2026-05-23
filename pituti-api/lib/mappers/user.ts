export function mapUser(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    photoUrl: row.photo_url,
    createdAt: row.created_at,
  };
}