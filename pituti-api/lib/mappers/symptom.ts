// lib/mappers/symptom.ts
// FIX: schema real tem 'symptom' e 'observed_date'.
// Migration V2 adiciona 'description' e 'date'.
// Este mapper lê ambos com fallback para compatibilidade total.
export function mapSymptom(row: any) {
  return {
    id:          row.id,
    petId:       row.pet_id,
    // Após migration: usa description. Sem migration: cai para symptom
    description: row.description ?? row.symptom ?? '',
    severity:    row.severity,
    // Após migration: usa date. Sem migration: cai para observed_date
    date: row.date
      ? String(row.date).substring(0, 10)
      : row.observed_date
      ? String(row.observed_date).substring(0, 10)
      : null,
    notes:       row.notes     ?? null,
    resolved:    row.resolved  ?? false,
    createdAt:   row.created_at,
  };
}
