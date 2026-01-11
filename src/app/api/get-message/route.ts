import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return sendErrorResponse(new ApiError(401, "Not Authenticated"));
  }

  const user = session.user as User;

  try {
    const userId = new mongoose.Types.ObjectId(user._id);

    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return sendResponse(200, { messages: [] }, "No messages found");
    }

    if (!result[0].messages || result[0].messages.length === 0) {
      return sendResponse(200, { messages: [] }, "No messages found");
    }

    return sendResponse(200, result[0], "Messages retrieved successfully");
  } catch (error) {
    console.error("Error while getting messages:", error);

    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }

    if (error instanceof mongoose.Error.CastError) {
      return sendErrorResponse(new ApiError(400, "Invalid user ID format"));
    }

    return sendErrorResponse(new ApiError(500, "Error while getting messages"));
  }
}