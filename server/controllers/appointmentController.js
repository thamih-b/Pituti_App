// server/controllers/appointmentController.js
import { appointmentService } from '../services/appointmentService.js'
import { HTTP } from '../config/httpStatus.js'

export const appointmentController = {
  async getAll(req, res, next) {
    try {
      const appts = await appointmentService.getAllForVet(req.params.vetId)
      res.json({ data: appts, total: appts.length })
    } catch (err) { next(err) }
  },

  async getOne(req, res, next) {
    try {
      res.json({ data: await appointmentService.getById(req.params.id) })
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({
        data: await appointmentService.create(req.params.vetId, req.validatedBody),
      })
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      res.json({
        data: await appointmentService.update(req.params.vetId, req.params.id, req.validatedBody),
      })
    } catch (err) { next(err) }
  },

  async delete(req, res, next) {
    try {
      await appointmentService.delete(req.params.vetId, req.params.id)
      res.status(HTTP.NO_CONTENT).send()
    } catch (err) { next(err) }
  },
}
