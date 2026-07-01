// lib/mappers/care.ts
// FIX: frequency pode ser VARCHAR (schema original) ou INTEGER (schema novo)
// FIX: time e status podem não existir antes da migration V2
export function mapCare(row: any) {
  return {
    id:         row.id,
    petId:      row.pet_id,
    name:       row.name,
    type:       row.type,
    // Converte para número se possível, para o frontend
    frequency:  row.frequency != null
      ? (typeof row.frequency === 'number'
          ? row.frequency
          : (isNaN(Number(row.frequency)) ? row.frequency : Number(row.frequency)))
      : null,
    periodType: row.period_type ?? null,
    time:       row.time       ?? null,
    notes:      row.notes      ?? null,
    status:     row.status     ?? 'pending',
    createdAt:  row.created_at,
  };
}