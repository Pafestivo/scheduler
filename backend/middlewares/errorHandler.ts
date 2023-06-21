import { Request, Response } from 'express';

const errorHandler = (error: Error, req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err: any = { ...error };
  err.message = error.message;
  console.log(error.message?.red); // assuming you have installed the 'colors' library

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
