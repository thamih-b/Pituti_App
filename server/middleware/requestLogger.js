/**  * Request logger middleware
 * Layer: Middleware — observability  */
export function requestLogger(req, _res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
}
