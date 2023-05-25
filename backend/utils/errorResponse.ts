interface ErrorResponseOptions {
  message: string;
  statusCode: number;
  errorCode?: string;
}

class ErrorResponse {
  statusCode: number;
  message: string;
  errorCode?: string;

  constructor(options: ErrorResponseOptions) {
    this.message = options.message;
    this.errorCode = options.errorCode;

    // set specific responses to prisma error codes
    if (this.errorCode === 'P2002') {
      this.statusCode = 409;
    } else {
      this.statusCode = options.statusCode;
    }
  }
}

export default ErrorResponse;