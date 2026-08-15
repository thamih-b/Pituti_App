import { z } from 'zod';

export const CreateUserSchema = z.object({
  name:     z.string().min(1, 'El nombre es obligatorio').max(100),
  email:    z.string().email('Email inválido'),
  // FIX (perfil): a app guarda a foto como base64 (data:image/...;base64,...),
  // não como um URL http(s) — z.string().url() rejeitava (ou pelo menos não
  // era pensado para) esse formato. Passa a aceitar qualquer string.
  photoUrl: z.string().optional().nullable(),
  // FIX (perfil): phone/bio/city nunca existiram aqui — eram sempre
  // descartados pelo Zod antes de chegar ao serviço, mesmo que o frontend
  // os enviasse.
  phone:    z.string().max(30).optional().nullable(),
  bio:      z.string().max(500).optional().nullable(),
  city:     z.string().max(150).optional().nullable(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
