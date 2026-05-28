// server/controllers/medicalProfileController.js
import { medicalProfileService } from '../services/medicalProfileService.js'

export const medicalProfileController = {
  async get(req, res, next) {
    try {
      res.json({ data: await medicalProfileService.get(req.params.petId) })
    } catch (err) { next(err) }
  },

  async upsert(req, res, next) {
    try {
      const profile = await medicalProfileService.upsert(req.params.petId, req.validatedBody)
      res.json({ data: profile })
    } catch (err) { next(err) }
  },
}
