import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();


  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    if (!user.isAcceptingMsg) {
      throw new ApiError(400, "User is not accepting any message");
    }

    const newMessage = { content, createdAt: new Date() };
    // const originalLength = user.messages.length;
    // console.log(originalLength);
    user.messages.push(newMessage as Message);
    // console.log(user.messages.length);
    // if (user.messages.length > originalLength) {
    //     console.log("Message added successfully!");
    //     console.log("username:", username, "\ncontent:", content);
    // }

    await user.save();

    return sendResponse(200, null, "message send successfully");
  } catch (error) {
    console.error("error while sending message");
    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(new ApiError(500, "error while sending message"));
  }
}
