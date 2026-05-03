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