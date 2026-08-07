// server/services/medicalProfileService.js
import { sql } from '../db.js'

function fromRow(r) {
  return { petId: r.pet_id, sex: r.sex, neutered: r.neutered, neuteredAge: r.neutered_age,
    // FIX (peso funcional): mapear weight_kg
    weightKg: r.weight_kg != null ? Number(r.weight_kg) : null,
    bloodType: r.blood_type, allergies: r.allergies ?? [], conditions: r.conditions ?? [],
    surgeries: r.surgeries ?? [], environment: r.environment,
    livingWithAnimals: r.living_with_animals, behavioralNotes: r.behavioral_notes,
    vetQuestions: r.vet_questions, updatedAt: r.updated_at }
}

function buildDefault(petId) {
  return { petId, sex: 'unknown', neutered: null, neuteredAge: null, weightKg: null, bloodType: null,
    allergies: [], conditions: [], surgeries: [], environment: null,
    livingWithAnimals: null, behavioralNotes: null, vetQuestions: null, updatedAt: null }
}

export const medicalProfileService = {
  async get(petId) {
    const rows = await sql`SELECT * FROM medical_profiles WHERE pet_id = ${petId}`
    return rows[0] ? fromRow(rows[0]) : buildDefault(petId)
  },
  async upsert(petId, data) {
    const [row] = await sql`
      INSERT INTO medical_profiles
        (pet_id, sex, neutered, neutered_age, weight_kg, blood_type, allergies, conditions, surgeries,
         environment, living_with_animals, behavioral_notes, vet_questions, updated_at)
      VALUES
        (${petId}, ${data.sex ?? 'unknown'}, ${data.neutered ?? null},
         ${data.neuteredAge ?? null}, ${data.weightKg ?? null}, ${data.bloodType ?? null},
         ${data.allergies ?? []}::text[],
         ${JSON.stringify(data.conditions ?? [])}::jsonb,
         ${JSON.stringify(data.surgeries ?? [])}::jsonb,
         ${data.environment ?? null}, ${data.livingWithAnimals ?? null},
         ${data.behavioralNotes ?? null}, ${data.vetQuestions ?? null}, NOW())
      ON CONFLICT (pet_id) DO UPDATE SET
        sex = EXCLUDED.sex, neutered = EXCLUDED.neutered, neutered_age = EXCLUDED.neutered_age,
        weight_kg = EXCLUDED.weight_kg,
        blood_type = EXCLUDED.blood_type, allergies = EXCLUDED.allergies,
        conditions = EXCLUDED.conditions, surgeries = EXCLUDED.surgeries,
        environment = EXCLUDED.environment, living_with_animals = EXCLUDED.living_with_animals,
        behavioral_notes = EXCLUDED.behavioral_notes, vet_questions = EXCLUDED.vet_questions,
        updated_at = NOW()
      RETURNING *`
    return fromRow(row)
  },
}
