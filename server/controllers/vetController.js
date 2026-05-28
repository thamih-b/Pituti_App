// server/controllers/vetController.js
import { vetService } from '../services/vetService.js'
import { HTTP } from '../config/httpStatus.js'

export const vetController = {
  async getAll(_req, res, next) {
    try {
      const vets = await vetService.getAll()
      res.json({ data: vets, total: vets.length })
    } catch (err) { next(err) }
  },

  async getOne(req, res, next) {
    try {
      res.json({ data: await vetService.getById(req.params.vetId) })
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: await vetService.create(req.validatedBody) })
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await vetService.update(req.params.vetId, req.validatedBody) })
    } catch (err) { next(err) }
  },

  async delete(req, res, next) {
    try {
      await vetService.delete(req.params.vetId)
      res.status(HTTP.NO_CONTENT).send()
    } catch (err) { next(err) }
  },
}
