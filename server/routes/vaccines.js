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