import { z } from 'zod';

export const CreateCareSchema = z.object({
  name:       z.string().min(1, 'El nombre es obligatorio').max(100),
  type:       z.string().min(1).max(50),
  frequency:  z.number().int().positive().optional(),
  periodType: z.enum(['day','week','month']).optional(),
  // FIX (sync): intervalo customizado ("a cada X dias"), usado quando periodType
  // não é day/week/month. Coluna interval_days já existe na tabela `cares`.
  intervalDays: z.number().int().positive().optional().nullable(),
  time:       z.string().optional().nullable(),
  notes:      z.string().max(500).optional().nullable(),
  status:     z.enum(['pending','done','skipped']).optional().default('pending'),
});

export const UpdateCareSchema = CreateCareSchema.partial().extend({
  // FIX (sync): estado diário de conclusão { "YYYY-MM-DD": { done, doneState } }.
  // Só faz sentido em updates (não na criação). Coluna done_dates já existe.
  doneDates: z.record(z.object({ done: z.number(), doneState: z.boolean() })).optional(),
});
