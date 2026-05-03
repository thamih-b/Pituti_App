import { z } from 'zod';

export const CreateSymptomSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria').max(300),
  severity:    z.enum(['mild','moderate','severe'], { message: 'Severidad inválida' }),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),
  notes:       z.string().max(500).optional().nullable(),
  resolved:    z.boolean().optional().default(false),
});

export const UpdateSymptomSchema = CreateSymptomSchema.partial();
