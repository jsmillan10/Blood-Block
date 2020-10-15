import express from 'express'
export function exceptionHandler(fn) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    fn(req, res, next).catch((error) => next(error))
  }
}
