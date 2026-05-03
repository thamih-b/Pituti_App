import { userService } from '../services/userService.js';
import { HTTP } from '../config/httpStatus.js';

export const userController = {
  getAll(_req, res, next) {
    try {
      const users = userService.getAll();
      res.json({ data: users, total: users.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: userService.getById(req.params.id) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: userService.create(req.validatedBody) });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({ data: userService.update(req.params.id, req.validatedBody) });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      userService.delete(req.params.id);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
