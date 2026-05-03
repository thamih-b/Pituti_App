import { z } from 'zod';

export const CreateCareSchema = z.object({
  name:       z.string().min(1, 'El nombre es obligatorio').max(100),
  type:       z.string().min(1).max(50),
  frequency:  z.number().int().positive().optional(),
  periodType: z.enum(['day','week','month']).optional(),
  time:       z.string().optional().nullable(),
  notes:      z.string().max(500).optional().nullable(),
  status:     z.enum(['pending','done','skipped']).optional().default('pending'),
});

export const UpdateCareSchema = CreateCareSchema.partial();
