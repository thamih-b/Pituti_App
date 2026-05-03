import { z } from 'zod';

const SPECIES = ['cat','dog','bird','rabbit','reptile','fish','other'];

export const CreatePetSchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(60),
  species:   z.enum(SPECIES, { message: 'Especie no válida' }),
  breed:     z.string().max(80).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)').optional(),
  photoUrl:  z.string().url().optional().nullable(),
  ownerId:   z.string().min(1, 'El ownerId es obligatorio'),
});

export const UpdatePetSchema = CreatePetSchema.partial().omit({ ownerId: true });
