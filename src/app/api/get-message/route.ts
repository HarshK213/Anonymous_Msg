import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendErrorResponse(new ApiError(500, "Not Authenticated"));
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    /*
        Mongo DB Aggregation pipeline is used.
    */

    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "message" },
      { $sort: { "message.createdAt": -1 } },
      { $group: { _id: "$_id", message: { $push: "$message" } } },
    ]);

    if (!user || user.length == 0) {
      throw new ApiError(404, "User not found");
    }

    return sendResponse(200, user[0].message, "messages retrieved");
  } catch (error) {
    console.error("Error while getting message");
    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(new ApiError(500, "Error while getting message"));
  }
}
