/**  * Zod body validation middleware factory
 * Layer: Middleware — input validation at network boundary
 *  * Usage: router.post('/', validate(MySchema), controller.create) */
 
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error); // ZodError → errorHandler
    }
    req.validatedBody = result.data;
    next();
  };
}
