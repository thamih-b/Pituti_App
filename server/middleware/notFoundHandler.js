/** * 404 fallback handler * Layer: Middleware */
import { HTTP } from '../config/httpStatus.js';

export function notFoundHandler(req, res) {
  res.status(HTTP.NOT_FOUND).json({
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}
