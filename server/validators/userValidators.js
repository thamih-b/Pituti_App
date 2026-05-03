import { z } from 'zod';

export const CreateUserSchema = z.object({
  name:     z.string().min(1, 'El nombre es obligatorio').max(100),
  email:    z.string().email('Email inválido'),
  photoUrl: z.string().url().optional().nullable(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
