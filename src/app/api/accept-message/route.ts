import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendErrorResponse(new ApiError(401, "Not Authenticated"));
  }

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMsg: acceptMessage },
      { new: true },
    );

    if (!updatedUser) {
      throw new ApiError(
        401,
        "failed to update user status to accepting message",
      );
    }

    return sendResponse(
      200,
      updatedUser,
      "Message acceptance updated successfully",
    );
  } catch (error) {
    console.error("failed to update user status to accept message");

    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }

    return sendErrorResponse(
      new ApiError(500, "failed to update use status to accept message"),
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendErrorResponse(new ApiError(500, "Not Authenticated"));
  }

  const userId = user._id;

  try {
    const userFound = await UserModel.findById(userId);

    if (!userFound) {
      throw new ApiError(401, "User not founc");
    }

    return sendResponse(
      200,
      userFound.isAcceptingMsg,
      "User found successfully",
    );
  } catch (error) {
    console.error("error in getting message acceptance status");
    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(
      new ApiError(500, "error in getting message acceptance status"),
    );
  }
}
