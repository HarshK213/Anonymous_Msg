import ApiResponse from "./ApiResponse";

class ApiError<TError = unknown> extends Error {
  statusCode: number;
  data: null;
  success: false;
  errors: TError[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: TError[] = [],
    stack?: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

export function sendErrorResponse<T>(error: ApiError<T>) {
  return Response.json(
    new ApiResponse<null>(error.statusCode, null, error.message),
    { status: error.statusCode },
  );
}
