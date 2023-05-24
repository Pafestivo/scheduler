interface ErrorResponseOptions {
  message: string;
  statusCode: number;
}

class ErrorResponse {
  statusCode: number;
  message: string;

  constructor(options: ErrorResponseOptions) {
    this.statusCode = options.statusCode;
    this.message = options.message;
  }
}
export default ErrorResponse;
