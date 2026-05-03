/**  * Generic sub-resource controller factory
 * Layer: Controllers  */

import { HTTP } from '../config/httpStatus.js';

export function createSubResourceController(service) {
  return {
    getAll(req, res, next) {
      try {
        const items = service.getAllForPet(req.params.petId);
        res.json({ data: items, total: items.length });
      } catch (err) { next(err); }
    },

    getOne(req, res, next) {
      try {
        const item = service.getById(req.params.petId, req.params.id);
        res.json({ data: item });
      } catch (err) { next(err); }
    },

    create(req, res, next) {
      try {
        const item = service.create(req.params.petId, req.validatedBody);
        res.status(HTTP.CREATED).json({ data: item });
      } catch (err) { next(err); }
    },

    update(req, res, next) {
      try {
        const item = service.update(req.params.petId, req.params.id, req.validatedBody);
        res.json({ data: item });
      } catch (err) { next(err); }
    },

    delete(req, res, next) {
      try {
        service.delete(req.params.petId, req.params.id);
        res.status(HTTP.NO_CONTENT).send();
      } catch (err) { next(err); }
    },
  };
}
