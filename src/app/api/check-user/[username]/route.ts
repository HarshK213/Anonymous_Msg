// import ApiError, { sendErrorResponse } from "@/lib/ApiError";
// import { sendResponse } from "@/lib/ApiResponse";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/user.model";

// export async function GET(request: Request, {params}:{params: {username: string}}) {
//     const {username} = await params;
//     await dbConnect();

//     try {

//         const existingVerifiedUser = await UserModel.findOne({
//             username,
//             isVerified: true,
//         });

//         if (!existingVerifiedUser) {
//             throw new ApiError(400, "user not found");
//         }

//         return sendResponse(200, null, "user found");
//     } catch (error) {
//         console.error("Error checking username : ", error);
//         if (error instanceof ApiError) {
//             return sendErrorResponse(error);
//         }
//         return sendErrorResponse(new ApiError(500, "Error Checking username"));
//     }
// }


import { NextRequest } from 'next/server';
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  // Await the params Promise first
  const { username } = await params;

  await dbConnect();

  try {
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (!existingVerifiedUser) {
      throw new ApiError(400, "user not found");
    }

    return sendResponse(200, null, "user found");
  } catch (error) {
    console.error("Error checking username : ", error);
    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(new ApiError(500, "Error Checking username"));
  }
}