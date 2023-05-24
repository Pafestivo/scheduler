interface ErrorResponseOptions {
  message: string;
  statusCode: number;
}

class ErrorResponse extends Error {
  statusCode: number;

  constructor(options: ErrorResponseOptions) {
    super(options.message);
    this.statusCode = options.statusCode;
  }
}

export default ErrorResponse;
