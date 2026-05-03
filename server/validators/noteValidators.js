import { z } from 'zod';

export const CreateNoteSchema = z.object({
  content:    z.string().min(1, 'El contenido es obligatorio').max(2000),
  veterinary: z.string().max(100).optional().nullable(),
  type:       z.enum(['control','observacion','emergencia','vacuna','cirugia','otro'])
                .optional().default('observacion'),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();
