import { z } from 'zod';

export const CreateUserSchema = z.object({
  name:     z.string().min(1, 'El nombre es obligatorio').max(100),
  email:    z.string().email('Email inválido'),
  photoUrl: z.string().optional().nullable(),
  phone:    z.string().max(30).optional().nullable(),
  bio:      z.string().max(500).optional().nullable(),
  city:     z.string().max(150).optional().nullable(),
  // FIX (sync): idioma nunca tinha campo aqui — descartado sempre pelo Zod
  language: z.enum(['es', 'en', 'pt']).optional().nullable(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
