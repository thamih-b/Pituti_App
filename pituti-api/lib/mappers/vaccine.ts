// lib/mappers/vaccine.ts
// FIX: schema real usa vaccine_date, next_dose_date, veterinarian
// O mapper lia row.date / row.next_due_date / row.veterinary (nomes errados)
export function mapVaccine(row: any) {
  return {
    id:          row.id,
    petId:       row.pet_id,
    name:        row.name,
    // Suporta tanto o schema real (vaccine_date) como possível alias futuro (date)
    date:        row.vaccine_date   ?? row.date         ?? null,
    nextDueDate: row.next_dose_date ?? row.next_due_date ?? null,
    // Schema real usa 'veterinarian', frontend espera 'veterinary'
    veterinary:  row.veterinarian   ?? row.veterinary   ?? null,
    notes:       row.notes          ?? null,
    createdAt:   row.created_at,
  };
}
