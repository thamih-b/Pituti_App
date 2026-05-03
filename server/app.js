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
