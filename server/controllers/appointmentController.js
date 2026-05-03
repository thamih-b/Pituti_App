import { appointmentService } from '../services/appointmentService.js';
import { HTTP } from '../config/httpStatus.js';

export const appointmentController = {
  getAll(req, res, next) {
    try {
      const appts = appointmentService.getAllForVet(req.params.vetId);
      res.json({ data: appts, total: appts.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: appointmentService.getById(req.params.id) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({
        data: appointmentService.create(req.params.vetId, req.validatedBody),
      });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({
        data: appointmentService.update(req.params.vetId, req.params.id, req.validatedBody),
      });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      appointmentService.delete(req.params.vetId, req.params.id);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
