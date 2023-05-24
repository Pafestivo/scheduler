import { NextFunction, Request, Response } from 'express';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  let err: any = { ...error };
  err.message = error.message;
  console.log(error.message?.red); // assuming you have installed the 'colors' library

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
