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
