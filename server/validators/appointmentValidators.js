import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  petId:               z.string().min(1, 'El petId es obligatorio'),
  type:                z.enum(['routine','emergency','specialist','followup','exam','vaccine','other'])
                         .optional().default('routine'),
  date:                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),
  vetContactId:        z.string().optional().nullable(),
  vetName:             z.string().min(1, 'El nombre del vet. es obligatorio').max(100),
  clinic:              z.string().max(100).optional().nullable(),
  reason:              z.string().min(1, 'El motivo es obligatorio').max(300),
  diagnosis:           z.string().max(500).optional().nullable(),
  treatment:           z.string().max(500).optional().nullable(),
  nextAppointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  nextAppointmentNote: z.string().max(300).optional().nullable(),
  weightKg:            z.number().positive().optional().nullable(),
  cost:                z.number().nonnegative().optional().nullable(),
  notes:               z.string().max(500).optional().nullable(),
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial();
