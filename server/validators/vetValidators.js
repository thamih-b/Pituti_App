import { z } from 'zod';

export const CreateVetSchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(100),
  clinic:    z.string().min(1, 'La clínica es obligatoria').max(100),
  type:      z.enum(['primary','specialist','emergency','other']).optional().default('primary'),
  specialty: z.string().max(100).optional().nullable(),
  phone:     z.string().min(1, 'El teléfono es obligatorio').max(30),
  phone2:    z.string().max(30).optional().nullable(),
  address:   z.string().max(200).optional().nullable(),
  notes:     z.string().max(500).optional().nullable(),
  petIds:    z.array(z.string()).optional().default([]),
});

export const UpdateVetSchema = CreateVetSchema.partial();
