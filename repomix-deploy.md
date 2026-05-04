This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: *.json, *.config.*, *.toml, *.yaml, *.yml, vercel.json, .env*, src/api/**, server/**, backend/**, api/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
eslint.config.js
package.json
server/app.js
server/config/httpStatus.js
server/controllers/appointmentController.js
server/controllers/medicalProfileController.js
server/controllers/petController.js
server/controllers/subResourceController.js
server/controllers/userController.js
server/controllers/vetController.js
server/data/helpers.js
server/data/store.js
server/index.js
server/middleware/errorHandler.js
server/middleware/notFoundHandler.js
server/middleware/requestLogger.js
server/middleware/validate.js
server/middleware/validateParams.js
server/package.json
server/routes/appointments.js
server/routes/cares.js
server/routes/medicalProfiles.js
server/routes/medications.js
server/routes/notes.js
server/routes/pets.js
server/routes/symptoms.js
server/routes/users.js
server/routes/vaccines.js
server/routes/vets.js
server/services/appointmentService.js
server/services/careService.js
server/services/medicalProfileService.js
server/services/medicationService.js
server/services/noteService.js
server/services/petService.js
server/services/subResourceService.js
server/services/symptomService.js
server/services/userService.js
server/services/vaccineService.js
server/services/vetService.js
server/validators/appointmentValidators.js
server/validators/careValidators.js
server/validators/medicalProfileValidators.js
server/validators/medicationValidators.js
server/validators/noteValidators.js
server/validators/petValidators.js
server/validators/symptomValidators.js
server/validators/userValidators.js
server/validators/vaccineValidators.js
server/validators/vetValidators.js
src/api/appointments.ts
src/api/cares.ts
src/api/client.ts
src/api/index.ts
src/api/medicalProfiles.ts
src/api/medications.ts
src/api/notes.ts
src/api/pets.ts
src/api/symptoms.ts
src/api/types.ts
src/api/users.ts
src/api/vaccines.ts
src/api/vets.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="eslint.config.js">
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
</file>

<file path="server/app.js">
/*Express bootstrap, monta todas as rotas*/

/**  * PITUTI API — Express Application
 * Layer: Application bootstrap  */

import express from 'express';
import cors from 'cors';

import { errorHandler }    from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { requestLogger }   from './middleware/requestLogger.js';

import usersRouter          from './routes/users.js';
import petsRouter           from './routes/pets.js';
import vaccinesRouter       from './routes/vaccines.js';
import medicationsRouter    from './routes/medications.js';
import symptomsRouter       from './routes/symptoms.js';
import caresRouter          from './routes/cares.js';
import notesRouter          from './routes/notes.js';
import medicalProfilesRouter from './routes/medicalProfiles.js';
import vetsRouter           from './routes/vets.js';
import appointmentsRouter   from './routes/appointments.js';

const app = express();

// ── Global middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PITUTI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /api/health',
      'GET  /api/users',
      'POST /api/users',
      'GET  /api/pets',
      'POST /api/pets',
      'GET  /api/pets/:petId/vaccines',
      'POST /api/pets/:petId/vaccines',
      'GET  /api/pets/:petId/medications',
      'POST /api/pets/:petId/medications',
      'GET  /api/pets/:petId/symptoms',
      'POST /api/pets/:petId/symptoms',
      'GET  /api/pets/:petId/cares',
      'POST /api/pets/:petId/cares',
      'GET  /api/pets/:petId/notes',
      'POST /api/pets/:petId/notes',
      'GET  /api/pets/:petId/medical-profile',
      'PUT  /api/pets/:petId/medical-profile',
      'GET  /api/vets',
      'POST /api/vets',
      'GET  /api/vets/:vetId/appointments',
      'POST /api/vets/:vetId/appointments',
    ],
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/users',                           usersRouter);
app.use('/api/pets',                            petsRouter);
app.use('/api/pets/:petId/vaccines',            vaccinesRouter);
app.use('/api/pets/:petId/medications',         medicationsRouter);
app.use('/api/pets/:petId/symptoms',            symptomsRouter);
app.use('/api/pets/:petId/cares',               caresRouter);
app.use('/api/pets/:petId/notes',               notesRouter);
app.use('/api/pets/:petId/medical-profile',     medicalProfilesRouter);
app.use('/api/vets',                            vetsRouter);
app.use('/api/vets/:vetId/appointments',        appointmentsRouter);

// ── Error handlers (must be last) ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
</file>

<file path="server/config/httpStatus.js">
/*Constantes HTTP (sin magic numbers)*/

/**  * HTTP status code constants
 * Prevents magic numbers scattered throughout the codebase  */

export const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_ERROR: 500,
};
</file>

<file path="server/controllers/appointmentController.js">
import { appointmentService } from '../services/appointmentService.js';
import { HTTP } from '../config/httpStatus.js';

export const appointmentController = {
  getAll(req, res, next) {
    try {
      const appts = appointmentService.getAllForVet(req.params.vetId);
      res.json({ data: appts, total: appts.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: appointmentService.getById(req.params.id) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({
        data: appointmentService.create(req.params.vetId, req.validatedBody),
      });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({
        data: appointmentService.update(req.params.vetId, req.params.id, req.validatedBody),
      });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      appointmentService.delete(req.params.vetId, req.params.id);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
</file>

<file path="server/controllers/medicalProfileController.js">
import { medicalProfileService } from '../services/medicalProfileService.js';

export const medicalProfileController = {
  get(req, res, next) {
    try {
      res.json({ data: medicalProfileService.get(req.params.petId) });
    } catch (err) { next(err); }
  },

  upsert(req, res, next) {
    try {
      const profile = medicalProfileService.upsert(req.params.petId, req.validatedBody);
      res.json({ data: profile });
    } catch (err) { next(err); }
  },
};
</file>

<file path="server/controllers/petController.js">
import { petService } from '../services/petService.js';
import { HTTP } from '../config/httpStatus.js';

export const petController = {
  getAll(req, res, next) {
    try {
      const { ownerId } = req.query;
      const pets = petService.getAll(ownerId);
      res.json({ data: pets, total: pets.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: petService.getById(req.params.petId) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: petService.create(req.validatedBody) });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({ data: petService.update(req.params.petId, req.validatedBody) });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      petService.delete(req.params.petId);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
</file>

<file path="server/controllers/subResourceController.js">
/**  * Generic sub-resource controller factory
 * Layer: Controllers  */

import { HTTP } from '../config/httpStatus.js';

export function createSubResourceController(service) {
  return {
    getAll(req, res, next) {
      try {
        const items = service.getAllForPet(req.params.petId);
        res.json({ data: items, total: items.length });
      } catch (err) { next(err); }
    },

    getOne(req, res, next) {
      try {
        const item = service.getById(req.params.petId, req.params.id);
        res.json({ data: item });
      } catch (err) { next(err); }
    },

    create(req, res, next) {
      try {
        const item = service.create(req.params.petId, req.validatedBody);
        res.status(HTTP.CREATED).json({ data: item });
      } catch (err) { next(err); }
    },

    update(req, res, next) {
      try {
        const item = service.update(req.params.petId, req.params.id, req.validatedBody);
        res.json({ data: item });
      } catch (err) { next(err); }
    },

    delete(req, res, next) {
      try {
        service.delete(req.params.petId, req.params.id);
        res.status(HTTP.NO_CONTENT).send();
      } catch (err) { next(err); }
    },
  };
}
</file>

<file path="server/controllers/userController.js">
import { userService } from '../services/userService.js';
import { HTTP } from '../config/httpStatus.js';

export const userController = {
  getAll(_req, res, next) {
    try {
      const users = userService.getAll();
      res.json({ data: users, total: users.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: userService.getById(req.params.id) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: userService.create(req.validatedBody) });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({ data: userService.update(req.params.id, req.validatedBody) });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      userService.delete(req.params.id);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
</file>

<file path="server/controllers/vetController.js">
import { vetService } from '../services/vetService.js';
import { HTTP } from '../config/httpStatus.js';

export const vetController = {
  getAll(_req, res, next) {
    try {
      const vets = vetService.getAll();
      res.json({ data: vets, total: vets.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: vetService.getById(req.params.vetId) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: vetService.create(req.validatedBody) });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({ data: vetService.update(req.params.vetId, req.validatedBody) });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      vetService.delete(req.params.vetId);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
</file>

<file path="server/data/helpers.js">
/**  * Store helper utilities
 * Layer: Data helpers  */

import { HTTP } from '../config/httpStatus.js';

export function createError(message, statusCode = HTTP.INTERNAL_ERROR) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export function assertExists(map, id, entityName = 'Recurso') {
  const item = map.get(id);
  if (!item) {
    throw createError(`${entityName} con id "${id}" no encontrado`, HTTP.NOT_FOUND);
  }
  return item;
}

export function filterMap(map, predicate) {
  return [...map.values()].filter(predicate);
}
</file>

<file path="server/data/store.js">
/**  * In-memory data store with seed data
 * Layer: Data — replace Map operations with DB calls in services for production  */

import { v4 as uuid } from 'uuid';

export const store = {
  users:          new Map(),
  pets:           new Map(),
  vaccines:       new Map(),
  medications:    new Map(),
  symptoms:       new Map(),
  cares:          new Map(),
  notes:          new Map(),
  medicalProfiles:new Map(),
  vets:           new Map(),
  appointments:   new Map(),
};

// ── Seed demo data ────────────────────────────────────────────────────────────
const demoUserId  = 'user-demo-001';
const demoPetId1  = 'pet-demo-001';
const demoPetId2  = 'pet-demo-002';
export const vetId = 'vet-demo-001';

store.users.set(demoUserId, {
  id: demoUserId,
  name: 'María García',
  email: 'maria@pituti.app',
  photoUrl: null,
  createdAt: '2024-01-15T10:00:00.000Z',
});

store.pets.set(demoPetId1, {
  id: demoPetId1,
  name: 'Luna',
  species: 'cat',
  breed: 'Siamés',
  birthDate: '2020-03-12',
  photoUrl: null,
  ownerId: demoUserId,
  createdAt: '2024-01-15T10:05:00.000Z',
});

store.pets.set(demoPetId2, {
  id: demoPetId2,
  name: 'Rocky',
  species: 'dog',
  breed: 'Labrador',
  birthDate: '2019-07-04',
  photoUrl: null,
  ownerId: demoUserId,
  createdAt: '2024-01-15T10:06:00.000Z',
});

store.vaccines.set('vacc-demo-001', {
  id: 'vacc-demo-001',
  petId: demoPetId1,
  name: 'Triple felina',
  date: '2024-06-01',
  nextDueDate: '2025-06-01',
  veterinary: 'Dra. Martínez',
  notes: 'Sin reacciones adversas',
  createdAt: '2024-06-01T09:00:00.000Z',
});

store.vaccines.set('vacc-demo-002', {
  id: 'vacc-demo-002',
  petId: demoPetId2,
  name: 'Polivalente',
  date: '2024-03-15',
  nextDueDate: '2025-03-15',
  veterinary: 'Dra. Martínez',
  notes: null,
  createdAt: '2024-03-15T10:00:00.000Z',
});

store.medications.set('med-demo-001', {
  id: 'med-demo-001',
  petId: demoPetId2,
  name: 'Frontline Plus',
  dosage: '1 pipeta',
  frequency: 'monthly',
  startDate: '2024-01-01',
  endDate: null,
  notes: 'Antiparasitario externo',
  createdAt: '2024-01-15T11:00:00.000Z',
});

store.symptoms.set('sym-demo-001', {
  id: 'sym-demo-001',
  petId: demoPetId2,
  description: 'Tos suave sin fiebre. Parece cansado.',
  severity: 'mild',
  date: '2026-04-18',
  notes: 'Come normal.',
  resolved: false,
  createdAt: '2026-04-18T08:00:00.000Z',
});

store.cares.set('care-demo-001', {
  id: 'care-demo-001',
  petId: demoPetId1,
  name: 'Alimentación',
  type: 'food',
  frequency: 2,
  periodType: 'day',
  time: '08:00',
  notes: '80g pienso seco',
  status: 'pending',
  createdAt: '2024-01-15T12:00:00.000Z',
});

store.vets.set(vetId, {
  id: vetId,
  name: 'Dra. Ana Martínez',
  clinic: 'Clínica VetSalud',
  type: 'primary',
  specialty: null,
  phone: '+34 612 345 678',
  phone2: null,
  address: 'Calle Mayor 12, Madrid',
  notes: 'Atiende lunes a viernes 9-18h',
  petIds: [demoPetId1, demoPetId2],
  createdAt: '2024-01-15T12:00:00.000Z',
});

store.appointments.set('appt-demo-001', {
  id: 'appt-demo-001',
  petId: demoPetId1,
  vetContactId: vetId,
  vetName: 'Dra. Ana Martínez',
  clinic: 'Clínica VetSalud',
  type: 'routine',
  date: '2026-03-10',
  reason: 'Revisión anual',
  diagnosis: 'Animal sano',
  treatment: null,
  nextAppointmentDate: '2027-03-10',
  nextAppointmentNote: 'Revisión anual',
  weightKg: 3.8,
  notes: null,
  createdAt: '2026-03-10T10:00:00.000Z',
});

store.medicalProfiles.set(demoPetId1, {
  petId: demoPetId1,
  sex: 'female',
  neutered: true,
  neuteredAge: '8 meses',
  bloodType: 'A',
  allergies: [],
  conditions: [],
  surgeries: [{ name: 'Esterilización', notes: 'Sin complicaciones' }],
  environment: 'apartment',
  livingWithAnimals: false,
  behavioralNotes: 'Tímida con extraños',
  vetQuestions: null,
  updatedAt: '2024-06-01T09:00:00.000Z',
});

export { demoUserId, demoPetId1, demoPetId2 };
</file>

<file path="server/index.js">
/*Entry point, arranca o servidor*/
/**  * PITUTI API Server — Entry point  */

import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
🐾  Servidor PITUTI corriendo en http://localhost:${PORT}`);
  console.log(`📄  Salud de la API:  http://localhost:${PORT}/api/health`);
  console.log(`🐕  Mascotas demo:    http://localhost:${PORT}/api/pets\n`);
});
</file>

<file path="server/middleware/errorHandler.js">
/**  * Global error handler middleware
 * Layer: Middleware — error boundary  */

import { HTTP } from '../config/httpStatus.js';

export function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.stack || err.message);

  if (err.name === 'ZodError') {
    return res.status(HTTP.BAD_REQUEST).json({
      error: 'Error de validación',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const status = err.statusCode || HTTP.INTERNAL_ERROR;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
  });
}
</file>

<file path="server/middleware/notFoundHandler.js">
/** * 404 fallback handler * Layer: Middleware */
import { HTTP } from '../config/httpStatus.js';

export function notFoundHandler(req, res) {
  res.status(HTTP.NOT_FOUND).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}
</file>

<file path="server/middleware/requestLogger.js">
/**  * Request logger middleware
 * Layer: Middleware — observability  */
export function requestLogger(req, _res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}
</file>

<file path="server/middleware/validate.js">
/**  * Zod body validation middleware factory
 * Layer: Middleware — input validation at network boundary
 *  * Usage: router.post('/', validate(MySchema), controller.create) */
 
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error); // ZodError → errorHandler
    }
    req.validatedBody = result.data;
    next();
  };
}
</file>

<file path="server/middleware/validateParams.js">
/**  * Zod URL-params validation middleware factory
 * Layer: Middleware — input validation at network boundary */
export function validateParams(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(result.error);
    }
    req.validatedParams = result.data;
    next();
  };
}
</file>

<file path="server/package.json">
{
  "name": "pituti-server",
  "version": "1.0.0",
  "description": "PITUTI Pet Care App — REST API Backend",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "express": "^4.22.1",
    "uuid": "^14.0.0",
    "zod": "^3.25.76"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
</file>

<file path="server/routes/appointments.js">
import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController.js';
import { validate } from '../middleware/validate.js';
import { CreateAppointmentSchema, UpdateAppointmentSchema } from '../validators/appointmentValidators.js';

const router = Router({ mergeParams: true });

router.get('/',      appointmentController.getAll);
router.get('/:id',   appointmentController.getOne);
router.post('/',     validate(CreateAppointmentSchema), appointmentController.create);
router.patch('/:id', validate(UpdateAppointmentSchema), appointmentController.update);
router.delete('/:id', appointmentController.delete);

export default router;
</file>

<file path="server/routes/cares.js">
// server/routes/cares.js  (mismo patrón para medications, symptoms, vaccine, notes)
import { Router } from 'express';
import { careService } from '../services/careService.js';
import { createSubResourceController } from '../controllers/subResourceController.js';
import { validate } from '../middleware/validate.js';
import { CreateCareSchema, UpdateCareSchema } from '../validators/careValidators.js';

const router = Router({ mergeParams: true });
const ctrl = createSubResourceController(careService);

router.get('/',      ctrl.getAll);
router.get('/:id',   ctrl.getOne);
router.post('/',     validate(CreateCareSchema), ctrl.create);
router.patch('/:id', validate(UpdateCareSchema), ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
</file>

<file path="server/routes/medicalProfiles.js">
// server/routes/medicalProfiles.js
import { Router } from 'express';
import { medicalProfileController } from '../controllers/medicalProfileController.js';
import { validate } from '../middleware/validate.js';
import { MedicalProfileSchema } from '../validators/medicalProfileValidators.js';

const router = Router({ mergeParams: true });

router.get('/',   medicalProfileController.get);
router.put('/',   validate(MedicalProfileSchema), medicalProfileController.upsert);

export default router;
</file>

<file path="server/routes/medications.js">
// server/routes/medications.js  (mismo patrón para vaccines, symptoms, cares, notes)
import { Router } from 'express';
import { medicationService } from '../services/medicationService.js';
import { createSubResourceController } from '../controllers/subResourceController.js';
import { validate } from '../middleware/validate.js';
import { CreateMedicationSchema, UpdateMedicationSchema } from '../validators/medicationValidators.js';

const router = Router({ mergeParams: true }); // ← mergeParams para heredar :petId
const ctrl = createSubResourceController(medicationService);

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getOne);
router.post('/',    validate(CreateMedicationSchema), ctrl.create);
router.patch('/:id',validate(UpdateMedicationSchema), ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
</file>

<file path="server/routes/notes.js">
// server/routes/notes.js  (mismo patrón para medications, symptoms, cares, vaccine)
import { Router } from 'express';
import { noteService } from '../services/noteService.js';
import { createSubResourceController } from '../controllers/subResourceController.js';
import { validate } from '../middleware/validate.js';
import { CreateNoteSchema, UpdateNoteSchema } from '../validators/noteValidators.js';

const router = Router({ mergeParams: true }); // ← mergeParams para heredar :petId
const ctrl = createSubResourceController(noteService);

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getOne);
router.post('/',    validate(CreateNoteSchema), ctrl.create);
router.patch('/:id',validate(UpdateNoteSchema), ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
</file>

<file path="server/routes/pets.js">
// server/routes/pets.js
import { Router } from 'express';
import { petController } from '../controllers/petController.js';
import { validate } from '../middleware/validate.js';
import { CreatePetSchema, UpdatePetSchema } from '../validators/petValidators.js';

const router = Router();

router.get('/',          petController.getAll);
router.get('/:petId',    petController.getOne);
router.post('/',         validate(CreatePetSchema), petController.create);
router.patch('/:petId',  validate(UpdatePetSchema),  petController.update);
router.delete('/:petId', petController.delete);

export default router;
</file>

<file path="server/routes/symptoms.js">
// server/routes/symptoms.js  (mismo patrón para medications, vaccines, cares, notes)
import { Router } from 'express';
import { symptomService } from '../services/symptomService.js';
import { createSubResourceController } from '../controllers/subResourceController.js';
import { validate } from '../middleware/validate.js';
import { CreateSymptomSchema, UpdateSymptomSchema } from '../validators/symptomValidators.js';

const router = Router({ mergeParams: true }); // ← mergeParams para heredar :petId
const ctrl = createSubResourceController(symptomService);

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getOne);
router.post('/',    validate(CreateSymptomSchema), ctrl.create);
router.patch('/:id',validate(UpdateSymptomSchema), ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
</file>

<file path="server/routes/users.js">
import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { CreateUserSchema, UpdateUserSchema } from '../validators/userValidators.js';

const router = Router();

router.get('/',    userController.getAll);
router.get('/:id', userController.getOne);
router.post('/',   validate(CreateUserSchema), userController.create);
router.patch('/:id', validate(UpdateUserSchema), userController.update);
router.delete('/:id', userController.delete);

export default router;
</file>

<file path="server/routes/vaccines.js">
// server/routes/vaccines.js  (mismo patrón para medications, symptoms, cares, notes)
import { Router } from 'express';
import { vaccineService } from '../services/vaccineService.js';
import { createSubResourceController } from '../controllers/subResourceController.js';
import { validate } from '../middleware/validate.js';
import { CreateVaccineSchema, UpdateVaccineSchema } from '../validators/vaccineValidators.js';

const router = Router({ mergeParams: true }); // ← mergeParams para heredar :petId
const ctrl = createSubResourceController(vaccineService);

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getOne);
router.post('/',    validate(CreateVaccineSchema), ctrl.create);
router.patch('/:id',validate(UpdateVaccineSchema), ctrl.update);
router.delete('/:id', ctrl.delete);

export default router;
</file>

<file path="server/routes/vets.js">
// server/routes/vets.js
import { Router } from 'express';
import { vetController } from '../controllers/vetController.js';
import { validate } from '../middleware/validate.js';
import { CreateVetSchema, UpdateVetSchema } from '../validators/vetValidators.js';

const router = Router();

router.get('/',          vetController.getAll);
router.get('/:vetId',    vetController.getOne);
router.post('/',         validate(CreateVetSchema), vetController.create);
router.patch('/:vetId',  validate(UpdateVetSchema),  vetController.update);
router.delete('/:vetId', vetController.delete);

export default router;
</file>

<file path="server/services/appointmentService.js">
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, filterMap } from '../data/helpers.js';

export const appointmentService = {
  getAllForVet(vetId) {
    assertExists(store.vets, vetId, 'Veterinario');
    return filterMap(store.appointments, a => a.vetContactId === vetId)
      .sort((a, b) => b.date.localeCompare(a.date)); 
  },

  getById(id) {
    return assertExists(store.appointments, id, 'Consulta');
  },

  create(vetId, data) {
    assertExists(store.vets, vetId, 'Veterinario');
    assertExists(store.pets, data.petId, 'Mascota');
    const appt = {
      ...data,
      vetContactId: vetId,
      id: uuid(),
      createdAt: new Date().toISOString(),
    };
    store.appointments.set(appt.id, appt);
    return appt;
  },

  update(vetId, id, data) {
    assertExists(store.vets, vetId, 'Veterinario');
    const appt = assertExists(store.appointments, id, 'Consulta');
    const updated = { ...appt, ...data };
    store.appointments.set(id, updated);
    return updated;
  },

  delete(vetId, id) {
    assertExists(store.vets, vetId, 'Veterinario');
    assertExists(store.appointments, id, 'Consulta');
    store.appointments.delete(id);
  },
};
</file>

<file path="server/services/careService.js">
import { createSubResourceService } from './subResourceService.js';
export const careService = createSubResourceService('cares', 'Cuidado');
</file>

<file path="server/services/medicalProfileService.js">
import { store } from '../data/store.js';
import { assertExists } from '../data/helpers.js';

export const medicalProfileService = {
  get(petId) {
    assertExists(store.pets, petId, 'Mascota');
    return store.medicalProfiles.get(petId) ?? buildDefault(petId);
  },

  upsert(petId, data) {
    assertExists(store.pets, petId, 'Mascota');
    const current = store.medicalProfiles.get(petId) ?? buildDefault(petId);
    const updated = { ...current, ...data, petId, updatedAt: new Date().toISOString() };
    store.medicalProfiles.set(petId, updated);
    return updated;
  },
};

function buildDefault(petId) {
  return {
    petId,
    sex: 'unknown',
    neutered: null,
    neuteredAge: null,
    bloodType: null,
    allergies: [],
    conditions: [],
    surgeries: [],
    environment: null,
    livingWithAnimals: null,
    behavioralNotes: null,
    vetQuestions: null,
    updatedAt: null,
  };
}
</file>

<file path="server/services/medicationService.js">
import { createSubResourceService } from './subResourceService.js';
export const medicationService = createSubResourceService('medications', 'Medicamento');
</file>

<file path="server/services/noteService.js">
import { createSubResourceService } from './subResourceService.js';
export const noteService = createSubResourceService('notes', 'Nota');
</file>

<file path="server/services/petService.js">
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, filterMap } from '../data/helpers.js';

export const petService = {
  getAll(ownerId) {
    const pets = ownerId
      ? filterMap(store.pets, p => p.ownerId === ownerId)
      : [...store.pets.values()];
    return pets.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  getById(id) {
    return assertExists(store.pets, id, 'Mascota');
  },

  create(data) {
    assertExists(store.users, data.ownerId, 'Usuario');
    const pet = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    store.pets.set(pet.id, pet);
    return pet;
  },

  update(id, data) {
    const pet = assertExists(store.pets, id, 'Mascota');
    const updated = { ...pet, ...data };
    store.pets.set(id, updated);
    return updated;
  },

  delete(id) {
    assertExists(store.pets, id, 'Mascota');
    store.pets.delete(id);
    // Cascade delete all related data
    for (const [k, v] of store.vaccines)    if (v.petId === id) store.vaccines.delete(k);
    for (const [k, v] of store.medications) if (v.petId === id) store.medications.delete(k);
    for (const [k, v] of store.symptoms)    if (v.petId === id) store.symptoms.delete(k);
    for (const [k, v] of store.cares)       if (v.petId === id) store.cares.delete(k);
    for (const [k, v] of store.notes)       if (v.petId === id) store.notes.delete(k);
    store.medicalProfiles.delete(id);
  },
};
</file>

<file path="server/services/subResourceService.js">
/**  * Generic sub-resource service factory
 * Layer: Services
 *
 * All pet-scoped resources (vaccines, medications, symptoms, cares, notes)
 * share the same CRUD pattern. This factory avoids ~200 lines of repetition.  */

import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, filterMap } from '../data/helpers.js';

export function createSubResourceService(storeKey, entityName) {
  return {
    getAllForPet(petId) {
      assertExists(store.pets, petId, 'Mascota');
      return filterMap(store[storeKey], item => item.petId === petId)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    },

    getById(petId, id) {
      assertExists(store.pets, petId, 'Mascota');
      const item = assertExists(store[storeKey], id, entityName);
      if (item.petId !== petId) {
        const err = new Error(`${entityName} no pertenece a esta mascota`);
        err.statusCode = 404;
        throw err;
      }
      return item;
    },

    create(petId, data) {
      assertExists(store.pets, petId, 'Mascota');
      const item = {
        ...data,
        petId,
        id: uuid(),
        createdAt: new Date().toISOString(),
      };
      store[storeKey].set(item.id, item);
      return item;
    },

    update(petId, id, data) {
      const item = this.getById(petId, id);
      const updated = { ...item, ...data };
      store[storeKey].set(id, updated);
      return updated;
    },

    delete(petId, id) {
      this.getById(petId, id);
      store[storeKey].delete(id);
    },
  };
}
</file>

<file path="server/services/symptomService.js">
import { createSubResourceService } from './subResourceService.js';
export const symptomService = createSubResourceService('symptoms', 'Síntoma');
</file>

<file path="server/services/userService.js">
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists, createError } from '../data/helpers.js';
import { HTTP } from '../config/httpStatus.js';

export const userService = {
  getAll() {
    return [...store.users.values()];
  },

  getById(id) {
    return assertExists(store.users, id, 'Usuario');
  },

  create(data) {
    const exists = [...store.users.values()].find(u => u.email === data.email);
    if (exists) throw createError('Ya existe un usuario con ese email', HTTP.CONFLICT);
    const user = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    store.users.set(user.id, user);
    return user;
  },

  update(id, data) {
    const user = assertExists(store.users, id, 'Usuario');
    const updated = { ...user, ...data };
    store.users.set(id, updated);
    return updated;
  },

  delete(id) {
    assertExists(store.users, id, 'Usuario');
    store.users.delete(id);
  },
};
</file>

<file path="server/services/vaccineService.js">
import { createSubResourceService } from './subResourceService.js';
export const vaccineService = createSubResourceService('vaccines', 'Vacuna');
</file>

<file path="server/services/vetService.js">
import { v4 as uuid } from 'uuid';
import { store } from '../data/store.js';
import { assertExists } from '../data/helpers.js';

export const vetService = {
  getAll() {
    return [...store.vets.values()];
  },

  getById(id) {
    return assertExists(store.vets, id, 'Veterinario');
  },

  create(data) {
    const vet = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    store.vets.set(vet.id, vet);
    return vet;
  },

  update(id, data) {
    const vet = assertExists(store.vets, id, 'Veterinario');
    const updated = { ...vet, ...data };
    store.vets.set(id, updated);
    return updated;
  },

  delete(id) {
    assertExists(store.vets, id, 'Veterinario');
    store.vets.delete(id);
  },
};
</file>

<file path="server/validators/appointmentValidators.js">
import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  petId:               z.string().min(1, 'El petId es obligatorio'),
  type:                z.enum(['routine','emergency','specialist','followup','exam','vaccine','other'])
                         .optional().default('routine'),
  date:                z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),
  vetContactId:        z.string().optional().nullable(),
  vetName:             z.string().min(1, 'El nombre del vet. es obligatorio').max(100),
  clinic:              z.string().max(100).optional().nullable(),
  reason:              z.string().min(1, 'El motivo es obligatorio').max(300),
  diagnosis:           z.string().max(500).optional().nullable(),
  treatment:           z.string().max(500).optional().nullable(),
  nextAppointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  nextAppointmentNote: z.string().max(300).optional().nullable(),
  weightKg:            z.number().positive().optional().nullable(),
  cost:                z.number().nonnegative().optional().nullable(),
  notes:               z.string().max(500).optional().nullable(),
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial();
</file>

<file path="server/validators/careValidators.js">
import { z } from 'zod';

export const CreateCareSchema = z.object({
  name:       z.string().min(1, 'El nombre es obligatorio').max(100),
  type:       z.string().min(1).max(50),
  frequency:  z.number().int().positive().optional(),
  periodType: z.enum(['day','week','month']).optional(),
  time:       z.string().optional().nullable(),
  notes:      z.string().max(500).optional().nullable(),
  status:     z.enum(['pending','done','skipped']).optional().default('pending'),
});

export const UpdateCareSchema = CreateCareSchema.partial();
</file>

<file path="server/validators/medicalProfileValidators.js">
import { z } from 'zod';

export const MedicalProfileSchema = z.object({
  sex:               z.enum(['male','female','unknown']).optional(),
  neutered:          z.boolean().optional().nullable(),
  neuteredAge:       z.string().max(30).optional().nullable(),
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
</file>

<file path="server/validators/medicationValidators.js">
import { z } from 'zod';

export const CreateMedicationSchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(100),
  dosage:    z.string().min(1, 'La dosis es obligatoria').max(100),
  frequency: z.string().min(1, 'La frecuencia es obligatoria').max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes:     z.string().max(500).optional().nullable(),
});

export const UpdateMedicationSchema = CreateMedicationSchema.partial();
</file>

<file path="server/validators/noteValidators.js">
import { z } from 'zod';

export const CreateNoteSchema = z.object({
  content:    z.string().min(1, 'El contenido es obligatorio').max(2000),
  veterinary: z.string().max(100).optional().nullable(),
  type:       z.enum(['control','observacion','emergencia','vacuna','cirugia','otro'])
                .optional().default('observacion'),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();
</file>

<file path="server/validators/petValidators.js">
import { z } from 'zod';

const SPECIES = ['cat','dog','bird','rabbit','reptile','fish','other'];

export const CreatePetSchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(60),
  species:   z.enum(SPECIES, { message: 'Especie no válida' }),
  breed:     z.string().max(80).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)').optional(),
  photoUrl:  z.string().url().optional().nullable(),
  ownerId:   z.string().min(1, 'El ownerId es obligatorio'),
});

export const UpdatePetSchema = CreatePetSchema.partial().omit({ ownerId: true });
</file>

<file path="server/validators/symptomValidators.js">
import { z } from 'zod';

export const CreateSymptomSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria').max(300),
  severity:    z.enum(['mild','moderate','severe'], { message: 'Severidad inválida' }),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido'),
  notes:       z.string().max(500).optional().nullable(),
  resolved:    z.boolean().optional().default(false),
});

export const UpdateSymptomSchema = CreateSymptomSchema.partial();
</file>

<file path="server/validators/userValidators.js">
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name:     z.string().min(1, 'El nombre es obligatorio').max(100),
  email:    z.string().email('Email inválido'),
  photoUrl: z.string().url().optional().nullable(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
</file>

<file path="server/validators/vaccineValidators.js">
import { z } from 'zod';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)');

export const CreateVaccineSchema = z.object({
  name:        z.string().min(1, 'El nombre es obligatorio').max(100),
  date:        date,
  nextDueDate: date.optional().nullable(),
  veterinary:  z.string().max(100).optional().nullable(),
  notes:       z.string().max(500).optional().nullable(),
});

export const UpdateVaccineSchema = CreateVaccineSchema.partial();
</file>

<file path="server/validators/vetValidators.js">
import { z } from 'zod';

export const CreateVetSchema = z.object({
  name:      z.string().min(1, 'El nombre es obligatorio').max(100),
  clinic:    z.string().min(1, 'La clínica es obligatoria').max(100),
  type:      z.enum(['primary','specialist','emergency','other']).optional().default('primary'),
  specialty: z.string().max(100).optional().nullable(),
  phone:     z.string().min(1, 'El teléfono es obligatorio').max(30),
  phone2:    z.string().max(30).optional().nullable(),
  address:   z.string().max(200).optional().nullable(),
  notes:     z.string().max(500).optional().nullable(),
  petIds:    z.array(z.string()).optional().default([]),
});

export const UpdateVetSchema = CreateVetSchema.partial();
</file>

<file path="src/api/appointments.ts">
import { api } from './client';
import type { ApiAppointment, CreateAppointmentDto, UpdateAppointmentDto } from './types';

export const appointmentsApi = {
  getAll:  (vetId: string)                                        => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`),
  getById: (vetId: string, id: string)                            => api.get<ApiAppointment>(`/vets/${vetId}/appointments/${id}`),
  create:  (vetId: string, dto: CreateAppointmentDto)             => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, dto),
  update:  (vetId: string, id: string, dto: UpdateAppointmentDto) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, dto),
  delete:  (vetId: string, id: string)                            => api.delete<void>(`/vets/${vetId}/appointments/${id}`),
};
</file>

<file path="src/api/cares.ts">
import { api } from './client';
import type { ApiCare, CreateCareDto, UpdateCareDto } from './types';

export const caresApi = {
  getAll:  (petId: string)                               => api.get<ApiCare[]>(`/pets/${petId}/cares`),
  getById: (petId: string, id: string)                   => api.get<ApiCare>(`/pets/${petId}/cares/${id}`),
  create:  (petId: string, dto: CreateCareDto)           => api.post<ApiCare>(`/pets/${petId}/cares`, dto),
  update:  (petId: string, id: string, dto: UpdateCareDto) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, dto),
  delete:  (petId: string, id: string)                   => api.delete<void>(`/pets/${petId}/cares/${id}`),
};
</file>

<file path="src/api/index.ts">
export {
  api,
  petsApi,
  vetsApi,
  appointmentsApi,
  medicationsApi,
  symptomsApi,
  caresApi,
  vaccinesApi,
  BASE_URL,
} from './client'

export type {
  ApiResponse,
  ApiError,
  ApiPet,
  ApiVet,
  ApiAppointment,
  ApiMedication,
  ApiSymptom,
  ApiCare,
  ApiVaccine,
} from './client'
</file>

<file path="src/api/medicalProfiles.ts">
import { api } from './client';
import type { ApiMedicalProfile, UpsertMedicalProfileDto } from './types';

export const medicalProfilesApi = {
  get:    (petId: string)                          => api.get<ApiMedicalProfile>(`/pets/${petId}/medical-profile`),
  upsert: (petId: string, dto: UpsertMedicalProfileDto) => api.put<ApiMedicalProfile>(`/pets/${petId}/medical-profile`, dto),
};
</file>

<file path="src/api/medications.ts">
import { api } from './client';
import type { ApiMedication, CreateMedicationDto, UpdateMedicationDto } from './types';

export const medicationsApi = {
  getAll:  (petId: string)                                    => api.get<ApiMedication[]>(`/pets/${petId}/medications`),
  getById: (petId: string, id: string)                        => api.get<ApiMedication>(`/pets/${petId}/medications/${id}`),
  create:  (petId: string, dto: CreateMedicationDto)          => api.post<ApiMedication>(`/pets/${petId}/medications`, dto),
  update:  (petId: string, id: string, dto: UpdateMedicationDto) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, dto),
  delete:  (petId: string, id: string)                        => api.delete<void>(`/pets/${petId}/medications/${id}`),
};
</file>

<file path="src/api/notes.ts">
import { api } from './client';
import type { ApiNote, CreateNoteDto, UpdateNoteDto } from './types';

export const notesApi = {
  getAll:  (petId: string)                               => api.get<ApiNote[]>(`/pets/${petId}/notes`),
  getById: (petId: string, id: string)                   => api.get<ApiNote>(`/pets/${petId}/notes/${id}`),
  create:  (petId: string, dto: CreateNoteDto)           => api.post<ApiNote>(`/pets/${petId}/notes`, dto),
  update:  (petId: string, id: string, dto: UpdateNoteDto) => api.patch<ApiNote>(`/pets/${petId}/notes/${id}`, dto),
  delete:  (petId: string, id: string)                   => api.delete<void>(`/pets/${petId}/notes/${id}`),
};
</file>

<file path="src/api/symptoms.ts">
import { api } from './client';
import type { ApiSymptom, CreateSymptomDto, UpdateSymptomDto } from './types';

export const symptomsApi = {
  getAll:  (petId: string)                                  => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`),
  getById: (petId: string, id: string)                      => api.get<ApiSymptom>(`/pets/${petId}/symptoms/${id}`),
  create:  (petId: string, dto: CreateSymptomDto)           => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, dto),
  update:  (petId: string, id: string, dto: UpdateSymptomDto) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, dto),
  delete:  (petId: string, id: string)                      => api.delete<void>(`/pets/${petId}/symptoms/${id}`),
};
</file>

<file path="src/api/types.ts">
/**
 * API contract types — aligned with backend validators and store shapes.
 * These are the "wire types" returned by the API (all ids are strings, dates are strings).
 * Import these in api modules and cast to domain types when needed.
 */

// ── Users ─────────────────────────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  createdAt: string;
}
export type CreateUserDto  = Omit<ApiUser, 'id' | 'createdAt'>;
export type UpdateUserDto  = Partial<CreateUserDto>;

// ── Pets ──────────────────────────────────────────────────────────────────────
export type ApiSpecies = 'cat' | 'dog' | 'bird' | 'rabbit' | 'reptile' | 'fish' | 'other';
export interface ApiPet {
  id: string;
  name: string;
  species: ApiSpecies;
  breed?: string;
  birthDate?: string;
  photoUrl: string | null;
  ownerId: string;
  createdAt: string;
}
export type CreatePetDto = Omit<ApiPet, 'id' | 'createdAt'>;
export type UpdatePetDto = Partial<Omit<CreatePetDto, 'ownerId'>>;

// ── Vaccines ──────────────────────────────────────────────────────────────────
export interface ApiVaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDueDate?: string | null;
  veterinary?: string | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateVaccineDto = Omit<ApiVaccine, 'id' | 'petId' | 'createdAt'>;
export type UpdateVaccineDto = Partial<CreateVaccineDto>;

// ── Medications ───────────────────────────────────────────────────────────────
export interface ApiMedication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateMedicationDto = Omit<ApiMedication, 'id' | 'petId' | 'createdAt'>;
export type UpdateMedicationDto = Partial<CreateMedicationDto>;

// ── Symptoms ──────────────────────────────────────────────────────────────────
export type ApiSeverity = 'mild' | 'moderate' | 'severe';
export interface ApiSymptom {
  id: string;
  petId: string;
  description: string;
  severity: ApiSeverity;
  date: string;
  notes?: string | null;
  resolved: boolean;
  createdAt: string;
}
export type CreateSymptomDto = Omit<ApiSymptom, 'id' | 'petId' | 'createdAt'>;
export type UpdateSymptomDto = Partial<CreateSymptomDto>;

// ── Cares ─────────────────────────────────────────────────────────────────────
export type ApiPeriodType = 'day' | 'week' | 'month';
export type ApiCareStatus = 'pending' | 'done' | 'skipped';
export interface ApiCare {
  id: string;
  petId: string;
  name: string;
  type: string;
  frequency?: number;
  periodType?: ApiPeriodType;
  time?: string | null;
  notes?: string | null;
  status: ApiCareStatus;
  createdAt: string;
}
export type CreateCareDto = Omit<ApiCare, 'id' | 'petId' | 'createdAt'>;
export type UpdateCareDto = Partial<CreateCareDto>;

// ── Notes ─────────────────────────────────────────────────────────────────────
export type ApiNoteType = 'control' | 'observacion' | 'emergencia' | 'vacuna' | 'cirugia' | 'otro';
export interface ApiNote {
  id: string;
  petId: string;
  content: string;
  veterinary?: string | null;
  type: ApiNoteType;
  createdAt: string;
}
export type CreateNoteDto = Omit<ApiNote, 'id' | 'petId' | 'createdAt'>;
export type UpdateNoteDto = Partial<CreateNoteDto>;

// ── Medical Profile ───────────────────────────────────────────────────────────
export interface ApiCondition { name: string; notes?: string; }
export interface ApiSurgery   { name: string; notes?: string; }
export interface ApiMedicalProfile {
  petId: string;
  sex?: 'male' | 'female' | 'unknown';
  neutered?: boolean | null;
  neuteredAge?: string | null;
  bloodType?: string | null;
  allergies: string[];
  conditions: ApiCondition[];
  surgeries: ApiSurgery[];
  environment?: 'apartment' | 'house' | 'both' | null;
  livingWithAnimals?: boolean | null;
  behavioralNotes?: string | null;
  vetQuestions?: string | null;
  updatedAt: string | null;
}
export type UpsertMedicalProfileDto = Omit<ApiMedicalProfile, 'petId' | 'updatedAt'>;

// ── Vets ──────────────────────────────────────────────────────────────────────
export type ApiVetType = 'primary' | 'specialist' | 'emergency' | 'other';
export interface ApiVet {
  id: string;
  name: string;
  clinic: string;
  type: ApiVetType;
  specialty?: string | null;
  phone: string;
  phone2?: string | null;
  address?: string | null;
  notes?: string | null;
  petIds: string[];
  createdAt: string;
}
export type CreateVetDto = Omit<ApiVet, 'id' | 'createdAt'>;
export type UpdateVetDto = Partial<CreateVetDto>;

// ── Appointments ──────────────────────────────────────────────────────────────
export type ApiAppointmentType = 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other';
export interface ApiAppointment {
  id: string;
  petId: string;
  vetContactId?: string | null;
  vetName: string;
  clinic?: string | null;
  type: ApiAppointmentType;
  date: string;
  reason: string;
  diagnosis?: string | null;
  treatment?: string | null;
  nextAppointmentDate?: string | null;
  nextAppointmentNote?: string | null;
  weightKg?: number | null;
  cost?: number | null;
  notes?: string | null;
  createdAt: string;
}
export type CreateAppointmentDto = Omit<ApiAppointment, 'id' | 'vetContactId' | 'createdAt'>;
export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;

// ── Health ────────────────────────────────────────────────────────────────────
export interface ApiHealth {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}
</file>

<file path="src/api/users.ts">
import { api } from './client';
import type { ApiUser, CreateUserDto, UpdateUserDto } from './types';

export const usersApi = {
  getAll:  ()                               => api.get<ApiUser[]>('/users'),
  getById: (id: string)                     => api.get<ApiUser>(`/users/${id}`),
  create:  (dto: CreateUserDto)             => api.post<ApiUser>('/users', dto),
  update:  (id: string, dto: UpdateUserDto) => api.patch<ApiUser>(`/users/${id}`, dto),
  delete:  (id: string)                     => api.delete<void>(`/users/${id}`),
};
</file>

<file path="src/api/vaccines.ts">
import { api } from './client';
import type { ApiVaccine, CreateVaccineDto, UpdateVaccineDto } from './types';

export const vaccinesApi = {
  getAll:  (petId: string)                             => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`),
  getById: (petId: string, id: string)                 => api.get<ApiVaccine>(`/pets/${petId}/vaccines/${id}`),
  create:  (petId: string, dto: CreateVaccineDto)      => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, dto),
  update:  (petId: string, id: string, dto: UpdateVaccineDto) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, dto),
  delete:  (petId: string, id: string)                 => api.delete<void>(`/pets/${petId}/vaccines/${id}`),
};
</file>

<file path="src/api/vets.ts">
import { api } from './client';
import type { ApiVet, CreateVetDto, UpdateVetDto } from './types';

export const vetsApi = {
  getAll:  ()                               => api.get<ApiVet[]>('/vets'),
  getById: (vetId: string)                  => api.get<ApiVet>(`/vets/${vetId}`),
  create:  (dto: CreateVetDto)              => api.post<ApiVet>('/vets', dto),
  update:  (vetId: string, dto: UpdateVetDto) => api.patch<ApiVet>(`/vets/${vetId}`, dto),
  delete:  (vetId: string)                  => api.delete<void>(`/vets/${vetId}`),
};
</file>

<file path="tsconfig.app.json">
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
</file>

<file path="tsconfig.json">
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
</file>

<file path="tsconfig.node.json">
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
</file>

<file path="src/api/client.ts">
/**
 * Pituti API Client
 * Camada de rede centralizada — todos os fetches passam por aqui.
 * Substitui chamadas fetch() diretas nos contexts.
 */

export const BASE_URL = 'http://localhost:3001/api'

// ── Tipos de resposta da API ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
}

export interface ApiError {
  status: number
  message: string
}

// ── Tipos de domínio (alinhados com server/data/store.js) ─────────────────────

export interface ApiPet {
  id:        string
  name:      string
  species:   'cat' | 'dog' | 'bird' | 'other'
  breed?:    string
  birthDate?:string
  photoUrl?: string
  ownerId:   string
  createdAt: string
}

export interface ApiVet {
  id:         string
  name:       string
  clinic:     string
  type:       'primary' | 'specialist' | 'emergency' | 'other'
  specialty?: string
  phone:      string
  phone2?:    string
  address?:   string
  notes?:     string
  petIds:     string[]
  createdAt:  string
}

export interface ApiAppointment {
  id:                   string
  petId:                string
  vetContactId?:        string
  vetName:              string
  clinic?:              string
  date:                 string
  time?:                string
  type:                 'routine' | 'emergency' | 'specialist' | 'followup' | 'exam' | 'vaccine' | 'other'
  reason:               string
  diagnosis?:           string
  treatment?:           string
  nextAppointmentDate?: string
  nextAppointmentNote?: string
  weightKg?:            number
  notes?:               string
  createdAt:            string
}

export interface ApiMedication {
  id:        string
  petId:     string
  name:      string
  dosage:    string
  frequency: string
  startDate?:string
  endDate?:  string | null
  notes?:    string
  createdAt: string
}

export interface ApiSymptom {
  id:          string
  petId:       string
  description: string
  severity:    'mild' | 'moderate' | 'severe'
  date:        string
  notes?:      string
  resolved:    boolean
  createdAt:   string
}

export interface ApiCare {
  id:         string
  petId:      string
  name:       string
  type:       'food' | 'water' | 'walk' | 'bath' | 'brush' | 'medication' | 'other'
  frequency:  number
  periodType: 'day' | 'week' | 'month'
  time?:      string
  notes?:     string
  status:     'pending' | 'done'
  createdAt:  string
}

export interface ApiVaccine {
  id:           string
  petId:        string
  name:         string
  date:         string
  nextDueDate?: string
  veterinary?:  string
  notes?:       string
  createdAt:    string
}

// ── Cliente HTTP ──────────────────────────────────────────────────────────────

class ApiClient {
  private base: string

  constructor(base: string) {
    this.base = base
  }

  private async request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.base}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }))
      throw { status: res.status, message: err.message ?? 'Unknown error' } satisfies ApiError
    }
    return res.json()
  }

  get<T>(path: string)                  { return this.request<T>(path) }
  post<T>(path: string, body: unknown)  { return this.request<T>(path, { method: 'POST',   body: JSON.stringify(body) }) }
  put<T>(path: string, body: unknown)   { return this.request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }) }
  patch<T>(path: string, body: unknown) { return this.request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }) }
  delete<T>(path: string)               { return this.request<T>(path, { method: 'DELETE' }) }
}

export const api = new ApiClient(BASE_URL)

// ── Recursos tipados ──────────────────────────────────────────────────────────

export const petsApi = {
  getAll:  ()                        => api.get<ApiPet[]>('/pets'),
  getById: (id: string)              => api.get<ApiPet>(`/pets/${id}`),
  create:  (body: Partial<ApiPet>)   => api.post<ApiPet>('/pets', body),
  update:  (id: string, body: Partial<ApiPet>) => api.patch<ApiPet>(`/pets/${id}`, body),
  delete:  (id: string)              => api.delete<void>(`/pets/${id}`),
}

export const vetsApi = {
  getAll:  ()                        => api.get<ApiVet[]>('/vets'),
  getById: (id: string)              => api.get<ApiVet>(`/vets/${id}`),
  create:  (body: Partial<ApiVet>)   => api.post<ApiVet>('/vets', body),
  update:  (id: string, body: Partial<ApiVet>) => api.patch<ApiVet>(`/vets/${id}`, body),
  delete:  (id: string)              => api.delete<void>(`/vets/${id}`),
}

export const appointmentsApi = {
  getAll:  (vetId: string)                           => api.get<ApiAppointment[]>(`/vets/${vetId}/appointments`),
  create:  (vetId: string, body: Partial<ApiAppointment>) => api.post<ApiAppointment>(`/vets/${vetId}/appointments`, body),
  update:  (vetId: string, id: string, body: Partial<ApiAppointment>) => api.patch<ApiAppointment>(`/vets/${vetId}/appointments/${id}`, body),
  delete:  (vetId: string, id: string)               => api.delete<void>(`/vets/${vetId}/appointments/${id}`),
}

export const medicationsApi = {
  getAll:  (petId: string)                              => api.get<ApiMedication[]>(`/pets/${petId}/medications`),
  create:  (petId: string, body: Partial<ApiMedication>) => api.post<ApiMedication>(`/pets/${petId}/medications`, body),
  update:  (petId: string, id: string, body: Partial<ApiMedication>) => api.patch<ApiMedication>(`/pets/${petId}/medications/${id}`, body),
  delete:  (petId: string, id: string)                  => api.delete<void>(`/pets/${petId}/medications/${id}`),
}

export const symptomsApi = {
  getAll:  (petId: string)                           => api.get<ApiSymptom[]>(`/pets/${petId}/symptoms`),
  create:  (petId: string, body: Partial<ApiSymptom>) => api.post<ApiSymptom>(`/pets/${petId}/symptoms`, body),
  update:  (petId: string, id: string, body: Partial<ApiSymptom>) => api.patch<ApiSymptom>(`/pets/${petId}/symptoms/${id}`, body),
  delete:  (petId: string, id: string)               => api.delete<void>(`/pets/${petId}/symptoms/${id}`),
}

export const caresApi = {
  getAll:  (petId: string)                        => api.get<ApiCare[]>(`/pets/${petId}/cares`),
  create:  (petId: string, body: Partial<ApiCare>) => api.post<ApiCare>(`/pets/${petId}/cares`, body),
  update:  (petId: string, id: string, body: Partial<ApiCare>) => api.patch<ApiCare>(`/pets/${petId}/cares/${id}`, body),
  delete:  (petId: string, id: string)            => api.delete<void>(`/pets/${petId}/cares/${id}`),
}

export const vaccinesApi = {
  getAll:  (petId: string)                           => api.get<ApiVaccine[]>(`/pets/${petId}/vaccines`),
  create:  (petId: string, body: Partial<ApiVaccine>) => api.post<ApiVaccine>(`/pets/${petId}/vaccines`, body),
  update:  (petId: string, id: string, body: Partial<ApiVaccine>) => api.patch<ApiVaccine>(`/pets/${petId}/vaccines/${id}`, body),
  delete:  (petId: string, id: string)               => api.delete<void>(`/pets/${petId}/vaccines/${id}`),
}
</file>

<file path="src/api/pets.ts">
import { api } from './client';
import type { ApiPet, CreatePetDto, UpdatePetDto } from './types';

export const petsApi = {
  getAll:  (ownerId?: string) => api.get<ApiPet[]>(`/pets${ownerId ? `?ownerId=${ownerId}` : ''}`),
  getById: (petId: string)    => api.get<ApiPet>(`/pets/${petId}`),
  create:  (dto: CreatePetDto)             => api.post<ApiPet>('/pets', dto),
  update:  (petId: string, dto: UpdatePetDto) => api.patch<ApiPet>(`/pets/${petId}`, dto),
  delete:  (petId: string)                 => api.delete<void>(`/pets/${petId}`),
};
</file>

<file path="vite.config.ts">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
</file>

<file path="package.json">
{
  "name": "pituti-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/vite": "^4.2.2",
    "@types/node": "^24.12.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "postcss": "^8.5.9",
    "tailwindcss": "^4.2.2",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.57.0",
    "vite": "^8.0.1"
  }
}
</file>

</files>
