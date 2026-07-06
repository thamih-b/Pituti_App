// pituti-api/lib/mappers/note.ts
export function mapNote(row: any) {
  return {
    id:        row.id,
    petId:     row.pet_id,
    type:      row.type,
    content:   row.content,
    // FIX: coluna pode chamar-se 'veterinary' (schema original) ou 'vet' (schema novo)
    vet:       row.veterinary ?? row.vet ?? null,
    // FIX: date não existia no schema original — fallback para created_at
    date:      row.date
      ? String(row.date).slice(0, 10)
      : row.created_at
      ? String(row.created_at).slice(0, 10)
      : null,
    createdAt: row.created_at,
  };
}
