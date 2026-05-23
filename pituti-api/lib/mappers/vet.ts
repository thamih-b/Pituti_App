export function mapVet(row: any) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    clinic: row.clinic,
    phone: row.phone,
    type: row.type,
    specialty: row.specialty,
    phone2: row.phone2,
    address: row.address,
    notes: row.notes,
    createdAt: row.created_at,
  };
}