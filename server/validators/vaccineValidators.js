import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)');

export const CreateVaccineSchema = z.object({
  name:        z.string().min(1, 'El nombre es obligatorio').max(100),
  date:        date.optional().nullable(),
  nextDueDate: date.optional().nullable(),
  veterinary:  z.string().max(100).optional().nullable(),
  notes:       z.string().max(500).optional().nullable(),
}).refine(
  d => d.date != null || d.nextDueDate != null,
  { message: 'É necessário indicar a data de aplicação ou a data agendada', path: ['date'] }
);

export const UpdateVaccineSchema = z.object({
  name:        z.string().min(1).max(100).optional(),
  date:        date.optional().nullable(),
  nextDueDate: date.optional().nullable(),
  veterinary:  z.string().max(100).optional().nullable(),
  notes:       z.string().max(500).optional().nullable(),
});
