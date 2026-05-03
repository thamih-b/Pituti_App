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
