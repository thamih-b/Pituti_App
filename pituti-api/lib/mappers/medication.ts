// lib/mappers/medication.ts
export function mapMedication(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    dosage: row.dosage,
    frequency: row.frequency,
    startDate: row.start_date,
    endDate: row.end_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}