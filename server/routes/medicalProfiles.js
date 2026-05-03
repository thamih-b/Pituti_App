// server/routes/medicalProfiles.js
import { Router } from 'express';
import { medicalProfileController } from '../controllers/medicalProfileController.js';
import { validate } from '../middleware/validate.js';
import { MedicalProfileSchema } from '../validators/medicalProfileValidators.js';

const router = Router({ mergeParams: true });

router.get('/',   medicalProfileController.get);
router.put('/',   validate(MedicalProfileSchema), medicalProfileController.upsert);

export default router;