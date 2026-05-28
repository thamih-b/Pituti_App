// server/controllers/subResourceController.js
import { HTTP } from '../config/httpStatus.js'

export function createSubResourceController(service) {
  return {
    async getAll(req, res, next) {
      try {
        const items = await service.getAllForPet(req.params.petId)
        res.json({ data: items, total: items.length })
      } catch (err) { next(err) }
    },

    async getOne(req, res, next) {
      try {
        res.json({ data: await service.getById(req.params.petId, req.params.id) })
      } catch (err) { next(err) }
    },

    async create(req, res, next) {
      try {
        const item = await service.create(req.params.petId, req.validatedBody)
        res.status(HTTP.CREATED).json({ data: item })
      } catch (err) { next(err) }
    },

    async update(req, res, next) {
      try {
        const item = await service.update(req.params.petId, req.params.id, req.validatedBody)
        res.json({ data: item })
      } catch (err) { next(err) }
    },

    async delete(req, res, next) {
      try {
        await service.delete(req.params.petId, req.params.id)
        res.status(HTTP.NO_CONTENT).send()
      } catch (err) { next(err) }
    },
  }
}
