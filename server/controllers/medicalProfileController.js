import { medicalProfileService } from '../services/medicalProfileService.js';

export const medicalProfileController = {
  get(req, res, next) {
    try {
      res.json({ data: medicalProfileService.get(req.params.petId) });
    } catch (err) { next(err); }
  },

  upsert(req, res, next) {
    try {
      const profile = medicalProfileService.upsert(req.params.petId, req.validatedBody);
      res.json({ data: profile });
    } catch (err) { next(err); }
  },
};
