// lib/mappers/care.ts
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
    periodType:   row.period_type ?? null,
    // FIX (sync): intervalo customizado ("a cada X dias") persistido no servidor
    intervalDays: row.interval_days != null ? Number(row.interval_days) : null,
    time:         row.time       ?? null,
    notes:        row.notes      ?? null,
    status:       row.status     ?? 'pending',
    // FIX (sync): estado diário de conclusão persistido no servidor.
    // done_dates vem como objeto (jsonb) ou, nalguns drivers, como string JSON.
    doneDates: typeof row.done_dates === 'string'
      ? JSON.parse(row.done_dates || '{}')
      : (row.done_dates ?? {}),
    createdAt:  row.created_at,
  };
}