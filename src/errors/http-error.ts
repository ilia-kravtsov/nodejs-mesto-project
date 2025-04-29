import { ErrorType } from './types';
import StatusCodes from '../constants/status-codes';

class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, error: ErrorType) {
    super(error.message);
    this.statusCode = statusCode;
    this.message = error.message;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(error: ErrorType) {
    return new HttpError(StatusCodes.BAD_REQUEST, error);
  }

  static forbidden(error: ErrorType) {
    return new HttpError(StatusCodes.FORBIDDEN, error);
  }

  static notFound(error: ErrorType) {
    return new HttpError(StatusCodes.NOT_FOUND, error);
  }

  static conflict(error: ErrorType) {
    return new HttpError(StatusCodes.CONFLICT, error);
  }
}

export default HttpError;
