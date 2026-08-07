import { z } from 'zod';

export const CreateNoteSchema = z.object({
  content:    z.string().min(1, 'El contenido es obligatorio').max(2000),
  veterinary: z.string().max(100).optional().nullable(),
  type:       z.enum(['control','observacion','emergencia','vacuna','cirugia','otro'])
                .optional().default('observacion'),
  // FIX (data da nota nunca era gravada): coluna note_date adicionada via
  // migração 004. Aceita tanto 'date' (nome usado no formulário) como
  // alias, sempre opcional para não partir notas antigas sem data.
  date:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)').optional().nullable(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();
