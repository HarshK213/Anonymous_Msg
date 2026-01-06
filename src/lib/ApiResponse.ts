import { NextResponse } from 'next/server';
import { Message } from '@/models/user.model'


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

// Define specific response types
export type ApiResponseData = {
  isAcceptingMsg?: boolean;
  messages?: Message[];
  // Add other possible response shapes
  [key: string]: unknown; // Use unknown instead of any
};

export const sendResponse = (
  status: number,
  data: ApiResponseData | null = null,
  message: string = ""
) => {
  return NextResponse.json(
    {
      success: status < 400,
      message,
      data,
    },
    { status }
  );
};