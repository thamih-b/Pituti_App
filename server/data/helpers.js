/**  * Store helper utilities
 * Layer: Data helpers  */

import { HTTP } from '../config/httpStatus.js';

export function createError(message, statusCode = HTTP.INTERNAL_ERROR) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export function assertExists(map, id, entityName = 'Recurso') {
  const item = map.get(id);
  if (!item) {
    throw createError(`${entityName} con id "${id}" no encontrado`, HTTP.NOT_FOUND);
  }
  return item;
}

export function filterMap(map, predicate) {
  return [...map.values()].filter(predicate);
}
