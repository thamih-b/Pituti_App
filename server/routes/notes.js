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