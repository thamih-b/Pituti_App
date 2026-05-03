/**  * Global error handler middleware
 * Layer: Middleware — error boundary  */

import { HTTP } from '../config/httpStatus.js';

export function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.stack || err.message);

  if (err.name === 'ZodError') {
    return res.status(HTTP.BAD_REQUEST).json({
      error: 'Error de validación',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const status = err.statusCode || HTTP.INTERNAL_ERROR;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
  });
}
