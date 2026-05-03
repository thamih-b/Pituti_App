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
