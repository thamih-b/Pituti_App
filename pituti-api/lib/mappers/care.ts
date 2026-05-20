// lib/mappers/care.ts
export function mapCare(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    type: row.type,
    frequency: row.frequency,
    periodType: row.period_type,
    time: row.time,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}