import express from 'express'
export function exceptionMiddleware(
  error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  console.log(error)
  // Express-validator
  if (
    (error.status === 400 ||
      error.statusCode === '400' ||
      error.statusCode === 400) &&
    error.data[0]?.msg
  ) {
    error.message = error.data[0].msg
  }
  const status = error.status || error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message, data })
}

export function exceptionHandler(fn) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    fn(req, res, next).catch((error) => next(error))
  }
}

export class CustomError extends Error {
  constructor(m: string, public statusCode: number) {
    super(m)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}
