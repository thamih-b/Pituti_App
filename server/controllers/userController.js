// server/controllers/userController.js
import { userService } from '../services/userService.js'
import { HTTP } from '../config/httpStatus.js'

export const userController = {
  async getAll(_req, res, next) {
    try {
      const users = await userService.getAll()
      res.json({ data: users, total: users.length })
    } catch (err) { next(err) }
  },

  async getOne(req, res, next) {
    try {
      res.json({ data: await userService.getById(req.params.id) })
    } catch (err) { next(err) }
  },

  async create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: await userService.create(req.validatedBody) })
    } catch (err) { next(err) }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await userService.update(req.params.id, req.validatedBody) })
    } catch (err) { next(err) }
  },

  async delete(req, res, next) {
    try {
      await userService.delete(req.params.id)
      res.status(HTTP.NO_CONTENT).send()
    } catch (err) { next(err) }
  },
}
