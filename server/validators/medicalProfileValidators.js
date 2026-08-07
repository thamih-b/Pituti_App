import { z } from 'zod';

export const MedicalProfileSchema = z.object({
  sex:               z.enum(['male','female','unknown']).optional(),
  neutered:          z.boolean().optional().nullable(),
  neuteredAge:       z.string().max(30).optional().nullable(),
  // FIX (peso funcional): coluna weight_kg adicionada via migração 003.
  weightKg:          z.number().positive().max(999).optional().nullable(),
  bloodType:         z.string().max(10).optional().nullable(),
  allergies:         z.array(z.string()).optional().default([]),
  conditions:        z.array(z.object({
                       name:  z.string().min(1).max(100),
                       notes: z.string().max(300).optional(),
                     })).optional().default([]),
  surgeries:         z.array(z.object({
                       name:  z.string().min(1).max(100),
                       notes: z.string().max(300).optional(),
                     })).optional().default([]),
  environment:       z.enum(['apartment','house','both']).optional().nullable(),
  livingWithAnimals: z.boolean().optional().nullable(),
  behavioralNotes:   z.string().max(1000).optional().nullable(),
  vetQuestions:      z.string().max(1000).optional().nullable(),
});
