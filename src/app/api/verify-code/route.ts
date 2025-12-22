import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    const isCodeValid = user.verifyCode == code;
    const isCodeNotExpired = new Date(user.verifyCodeExp) > new Date();
    const isValidated = user.isVerified;

    if (isCodeNotExpired && isCodeValid && !isValidated) {
      user.isVerified = true;
      await user.save();
      return sendResponse(200, null, "Account Verified successfully");
    } else if(isValidated){
        throw new ApiError(
            400,
            "User has already verified"
        );
    } else if (!isCodeNotExpired) {
      throw new ApiError(
        400,
        "verification code has expired\nPlease signin again to get a new code",
      );
    } else {
      console.log(user);
      throw new ApiError(400, "Invalid verification code");
    }
  } catch (error) {
    console.error("Error verifying code :", error);

    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(new ApiError(500, "Error verifying code"));
  }
}
