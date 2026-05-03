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