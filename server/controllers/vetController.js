import { vetService } from '../services/vetService.js';
import { HTTP } from '../config/httpStatus.js';

export const vetController = {
  getAll(_req, res, next) {
    try {
      const vets = vetService.getAll();
      res.json({ data: vets, total: vets.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: vetService.getById(req.params.vetId) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: vetService.create(req.validatedBody) });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({ data: vetService.update(req.params.vetId, req.validatedBody) });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      vetService.delete(req.params.vetId);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
