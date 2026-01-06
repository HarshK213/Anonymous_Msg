import { NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageid: string }> }
) {
  // Await the params Promise
  const { messageid } = await params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendErrorResponse(new ApiError(500, "Not Authenticated"));
  }

  try {
    const userId = new mongoose.Types.ObjectId(user._id);
    const messageObjectId = new mongoose.Types.ObjectId(messageid);

    const updatedResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { message: { _id: messageObjectId } } }
    );

    if (updatedResult.modifiedCount == 0 || !updatedResult.acknowledged) {
      throw new ApiError(404, "Message not found or already deleted");
    }

    return sendResponse(200, null, "Message deleted successfully");

  } catch (error) {
    console.error("Error in deleting message");
    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }

    return sendErrorResponse(new ApiError(500, "Error in deleting message"));
  }
}