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