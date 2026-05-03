import { petService } from '../services/petService.js';
import { HTTP } from '../config/httpStatus.js';

export const petController = {
  getAll(req, res, next) {
    try {
      const { ownerId } = req.query;
      const pets = petService.getAll(ownerId);
      res.json({ data: pets, total: pets.length });
    } catch (err) { next(err); }
  },

  getOne(req, res, next) {
    try {
      res.json({ data: petService.getById(req.params.petId) });
    } catch (err) { next(err); }
  },

  create(req, res, next) {
    try {
      res.status(HTTP.CREATED).json({ data: petService.create(req.validatedBody) });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      res.json({ data: petService.update(req.params.petId, req.validatedBody) });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      petService.delete(req.params.petId);
      res.status(HTTP.NO_CONTENT).send();
    } catch (err) { next(err); }
  },
};
