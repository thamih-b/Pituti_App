// lib/mappers/vaccine.ts
// FIX: colunas reais do DB são vaccine_date, next_dose_date, veterinarian
// O mapper converte para os nomes que o frontend espera: date, nextDueDate, veterinary
export function mapVaccine(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    // Suporta tanto o schema antigo (vaccine_date) como futuro (date)
    date: row.vaccine_date ?? row.date ?? null,
    // Suporta tanto next_dose_date (schema) como next_due_date (futuro)
    nextDueDate: row.next_dose_date ?? row.next_due_date ?? null,
    // Suporta tanto veterinarian (schema) como veterinary (futuro)
    veterinary: row.veterinarian ?? row.veterinary ?? null,
    notes: row.notes ?? null,
    createdAt: row.created_at,
  };
}
