/**  * Zod URL-params validation middleware factory
 * Layer: Middleware — input validation at network boundary */
export function validateParams(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(result.error);
    }
    req.validatedParams = result.data;
    next();
  };
}
