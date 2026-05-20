// lib/mappers/symptom.ts
export function mapSymptom(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    description: row.description,
    severity: row.severity,
    date: row.date,
    notes: row.notes,
    resolved: row.resolved,
    createdAt: row.created_at,
  };
}