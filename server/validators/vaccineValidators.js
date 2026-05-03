import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)');

export const CreateVaccineSchema = z.object({
  name:        z.string().min(1, 'El nombre es obligatorio').max(100),
  date:        date,
  nextDueDate: date.optional().nullable(),
  veterinary:  z.string().max(100).optional().nullable(),
  notes:       z.string().max(500).optional().nullable(),
});

export const UpdateVaccineSchema = CreateVaccineSchema.partial();
