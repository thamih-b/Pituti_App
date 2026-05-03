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