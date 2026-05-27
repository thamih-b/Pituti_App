-- Pituti Database Schema
-- PostgreSQL 14+

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de utilizadores
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pets
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(60) NOT NULL,
  species VARCHAR(20) NOT NULL CHECK (species IN ('cat', 'dog', 'bird', 'rabbit', 'reptile', 'fish', 'other')),
  breed VARCHAR(80),
  birth_date DATE,
  photo_url TEXT,
  color VARCHAR(60),
  microchip VARCHAR(20),
  passport VARCHAR(60),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfis médicos
CREATE TABLE IF NOT EXISTS medical_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL UNIQUE REFERENCES pets(id) ON DELETE CASCADE,
  weight_kg DECIMAL(6, 2),
  blood_type VARCHAR(10),
  allergies TEXT,
  chronic_conditions TEXT,
  special_diet TEXT,
  veterinarian_name VARCHAR(100),
  veterinarian_phone VARCHAR(20),
  veterinarian_clinic VARCHAR(150),
  insurance_number VARCHAR(100),
  insurance_provider VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de vacinas
CREATE TABLE IF NOT EXISTS vaccines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  vaccine_date DATE NOT NULL,
  next_dose_date DATE,
  batch_number VARCHAR(50),
  veterinarian VARCHAR(100),
  clinic VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de medicamentos
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  frequency VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  prescribed_by VARCHAR(100),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sintomas
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  symptom VARCHAR(100) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
  description TEXT,
  observed_date TIMESTAMP WITH TIME ZONE NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cuidados/rotinas
CREATE TABLE IF NOT EXISTS cares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  frequency VARCHAR(50),
  period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  last_done TIMESTAMP WITH TIME ZONE,
  next_due TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notas
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  title VARCHAR(150),
  content TEXT NOT NULL,
  note_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de veterinários
CREATE TABLE IF NOT EXISTS vets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  clinic VARCHAR(150),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  specialization VARCHAR(100),
  notes TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de consultas
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vet_id UUID NOT NULL REFERENCES vets(id) ON DELETE CASCADE,
  vet_name VARCHAR(100),
  clinic VARCHAR(150),
  type VARCHAR(50),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  diagnosis TEXT,
  treatment TEXT,
  next_appointment_date DATE,
  next_appointment_note TEXT,
  weight_kg DECIMAL(6, 2),
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pets_owner ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet ON vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_medications_pet ON medications(pet_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_pet ON symptoms(pet_id);
CREATE INDEX IF NOT EXISTS idx_cares_pet ON cares(pet_id);
CREATE INDEX IF NOT EXISTS idx_notes_pet ON notes(pet_id);
CREATE INDEX IF NOT EXISTS idx_vets_owner ON vets(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_pet ON appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_vet ON appointments(vet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_profiles_updated_at BEFORE UPDATE ON medical_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccines_updated_at BEFORE UPDATE ON vaccines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON symptoms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cares_updated_at BEFORE UPDATE ON cares
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vets_updated_at BEFORE UPDATE ON vets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Utilizadores da aplicação';
COMMENT ON TABLE pets IS 'Pets registados pelos utilizadores';
COMMENT ON TABLE medical_profiles IS 'Perfis médicos dos pets';
COMMENT ON TABLE vaccines IS 'Vacinas administradas aos pets';
COMMENT ON TABLE medications IS 'Medicamentos e tratamentos dos pets';
COMMENT ON TABLE symptoms IS 'Sintomas observados nos pets';
COMMENT ON TABLE cares IS 'Rotinas e cuidados recorrentes';
COMMENT ON TABLE notes IS 'Notas gerais sobre os pets';
COMMENT ON TABLE vets IS 'Veterinários cadastrados';
COMMENT ON TABLE appointments IS 'Consultas veterinárias';
