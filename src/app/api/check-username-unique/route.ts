import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signup.schema";
import { sendResponse } from "@/lib/ApiResponse";
import { sendErrorResponse } from "@/lib/ApiError";
import ApiError from "@/lib/ApiError";

const userNameValidSchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = userNameValidSchema.safeParse(queryParams);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      throw new ApiError(
        400,
        usernameErrors.length > 0
          ? usernameErrors.join(", ")
          : "Invalid query parameters"
      );
    }

    const { username } = result.data;
    console.log(username);

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      throw new ApiError(400, "Username already taken");
    }

    return sendResponse(200, null, "username is unique");
  } catch (error) {
    console.error("Error checking username : ", error);
    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(new ApiError(500, "Error Checking username"));
  }
}
