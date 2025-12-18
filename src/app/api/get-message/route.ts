import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import mongoose, { Mongoose } from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendErrorResponse(new ApiError(500, "Not Authenticated"));
  }

  const userId = new mongoose.Types.ObjectId(user._id);
}
