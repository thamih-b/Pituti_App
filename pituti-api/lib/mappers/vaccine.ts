export function mapVaccine(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    date: row.date,
    nextDueDate: row.next_due_date,
    veterinary: row.veterinary,
    notes: row.notes,
    createdAt: row.created_at,
  };
}