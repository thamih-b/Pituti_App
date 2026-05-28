// server/controllers/petController.js
import { petService } from '../services/petService.js'
import { HTTP } from '../config/httpStatus.js'

export const petController = {
  async getAll(req, res, next) {
    try {
      const { ownerId } = req.query
      const pets = await petService.getAll(ownerId)
      res.json({ data: pets, total: pets.length })
    } catch (err) { next(err) }
  },

  async getOne(req, res, next) {
    try {
      res.json({ data: await petService.getById(req.params.petId) })
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: await petService.create(req.validatedBody) })
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await petService.update(req.params.petId, req.validatedBody) })
    } catch (err) { next(err) }
  },

  async delete(req, res, next) {
    try {
      await petService.delete(req.params.petId)
      res.status(HTTP.NO_CONTENT).send()
    } catch (err) { next(err) }
  },
}
