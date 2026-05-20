-- ============================================================
-- PITUTI DB — Schema
-- ============================================================

-- USERS
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),          -- NULL enquanto não há auth
  photo_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PETS
CREATE TABLE pets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(60) NOT NULL,
  species     VARCHAR(20) NOT NULL CHECK (species IN ('cat','dog','bird','rabbit','reptile','fish','other')),
  breed       VARCHAR(80),
  birth_date  DATE,
  photo_url   TEXT,
  color       VARCHAR(60),
  microchip   VARCHAR(20),
  passport    VARCHAR(60),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- VACCINES
CREATE TABLE vaccines (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id       UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name         VARCHAR(100) NOT NULL,
  date         DATE NOT NULL,
  next_due_date DATE,
  veterinary   VARCHAR(100),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- MEDICATIONS
CREATE TABLE medications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  dosage      VARCHAR(100) NOT NULL,
  frequency   VARCHAR(100) NOT NULL,
  start_date  DATE,
  end_date    DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- SYMPTOMS
CREATE TABLE symptoms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  description VARCHAR(300) NOT NULL,
  severity    VARCHAR(20) NOT NULL CHECK (severity IN ('mild','moderate','severe')),
  date        DATE NOT NULL,
  notes       TEXT,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CARES (rotinas diárias)
CREATE TABLE cares (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(50) NOT NULL,
  frequency   INTEGER,
  period_type VARCHAR(10) CHECK (period_type IN ('day','week','month')),
  time        VARCHAR(5),
  notes       TEXT,
  status      VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending','done','skipped')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- VETS
CREATE TABLE vets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  clinic      VARCHAR(100) NOT NULL,
  type        VARCHAR(20) DEFAULT 'primary' CHECK (type IN ('primary','specialist','emergency','other')),
  specialty   VARCHAR(100),
  phone       VARCHAR(30) NOT NULL,
  phone2      VARCHAR(30),
  address     VARCHAR(200),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- VET_PETS (relação N:N entre vets e pets)
CREATE TABLE vet_pets (
  vet_id  UUID NOT NULL REFERENCES vets(id) ON DELETE CASCADE,
  pet_id  UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  PRIMARY KEY (vet_id, pet_id)
);

-- APPOINTMENTS
CREATE TABLE appointments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id               UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vet_id               UUID REFERENCES vets(id) ON DELETE SET NULL,
  vet_name             VARCHAR(100) NOT NULL,
  clinic               VARCHAR(100),
  type                 VARCHAR(20) DEFAULT 'routine' CHECK (type IN ('routine','emergency','specialist','followup','exam','vaccine','other')),
  date                 DATE NOT NULL,
  reason               VARCHAR(300) NOT NULL,
  diagnosis            TEXT,
  treatment            TEXT,
  next_appointment_date DATE,
  next_appointment_note VARCHAR(300),
  weight_kg            NUMERIC(5,2),
  cost                 NUMERIC(8,2),
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- NOTES (notas clínicas por pet)
CREATE TABLE notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id     UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  veterinary VARCHAR(100),
  type       VARCHAR(20) DEFAULT 'observacao' CHECK (type IN ('control','observacao','emergencia','vacuna','cirugia','otro')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEDICAL PROFILES (1:1 com pets)
CREATE TABLE medical_profiles (
  pet_id              UUID PRIMARY KEY REFERENCES pets(id) ON DELETE CASCADE,
  sex                 VARCHAR(10) CHECK (sex IN ('male','female','unknown')),
  neutered            BOOLEAN,
  neutered_age        VARCHAR(30),
  blood_type          VARCHAR(10),
  allergies           TEXT[] DEFAULT '{}',
  conditions          JSONB DEFAULT '[]',
  surgeries           JSONB DEFAULT '[]',
  environment         VARCHAR(10) CHECK (environment IN ('apartment','house','both')),
  living_with_animals BOOLEAN,
  behavioral_notes    TEXT,
  vet_questions       TEXT,
  updated_at          TIMESTAMPTZ
);