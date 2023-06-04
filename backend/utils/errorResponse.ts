interface ErrorResponseOptions {
  message: string;
  statusCode: number | string;
  errorCode?: string;
}

class ErrorResponse {
  statusCode: number | string;
  message: string;
  errorCode?: string;

  constructor(options: ErrorResponseOptions) {
    this.message = options.message;
    this.errorCode = options.errorCode;

    // set specific responses to prisma error codes
    
    if (this.errorCode === 'P2002') {
      this.message = "Conflict! Data already exists in the database."
      this.statusCode = 409;
    } else if (this.errorCode === "P2025") {
      this.message = "Not found"
      this.statusCode = 404;
    } else if (this.errorCode) {
      this.statusCode = this.errorCode;
    } else {
      this.statusCode = options.statusCode;
    }
  }
}

export default ErrorResponse;