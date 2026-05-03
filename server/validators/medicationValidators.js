import { z } from 'zod';

export const CreateMedicationSchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(100),
  dosage:    z.string().min(1, 'La dosis es obligatoria').max(100),
  frequency: z.string().min(1, 'La frecuencia es obligatoria').max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes:     z.string().max(500).optional().nullable(),
});

export const UpdateMedicationSchema = CreateMedicationSchema.partial();
