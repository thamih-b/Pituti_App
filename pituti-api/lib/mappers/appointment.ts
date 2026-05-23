export function mapAppointment(row: any) {
  return {
    id: row.id,
    petId: row.pet_id,
    vetId: row.vet_id,
    vetName: row.vet_name,
    clinic: row.clinic,
    type: row.type,
    date: row.date,
    reason: row.reason,
    diagnosis: row.diagnosis,
    treatment: row.treatment,
    nextAppointmentDate: row.next_appointment_date,
    nextAppointmentNote: row.next_appointment_note,
    weightKg: row.weight_kg,
    cost: row.cost,
    notes: row.notes,
    createdAt: row.created_at,
  };
}