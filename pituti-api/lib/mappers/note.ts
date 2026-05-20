// lib/mappers/note.ts
export function mapNote(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    content: row.content,
    veterinary: row.veterinary,
    type: row.type,
    createdAt: row.created_at,
  };
}