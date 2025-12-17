class ApiResponse<T = null> {
  statuscode: number;
  data: T | null;
  message: string;
  success: boolean;

  constructor(
    statuscode: number,
    data: T | null = null,
    message: string = "SUCCESS",
  ) {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400;
  }
}

export default ApiResponse;

export function sendResponse<T = null>(
  statusCode: number,
  data?: T,
  message?: string,
) {
  return Response.json(new ApiResponse<T>(statusCode, data ?? null, message), {
    status: statusCode,
  });
}
