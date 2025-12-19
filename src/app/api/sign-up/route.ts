import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import ApiError, { sendErrorResponse } from "@/lib/ApiError";
import { sendResponse } from "@/lib/ApiResponse";

export const POST = async (request: Request) => {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      throw new ApiError(400, "Username is already taken");
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        throw new ApiError(400, "user already exist with this email");
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExp = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode: verifyCode,
        verifyCodeExp: expiryDate,
        isVerified: false,
        isAcceptinMessage: true,
        message: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    console.log("Hello");

    if (!emailResponse.success) {
      throw new ApiError(500, emailResponse.message);
    }
    return sendResponse(
      201,
      emailResponse,
      "User registered successfully , Please verify your email",
    );
  } catch (error) {
    console.log("Error while registering user", error);

    if (error instanceof ApiError) {
      return sendErrorResponse(error);
    }
    return sendErrorResponse(new ApiError(500, "Error registering user"));
  }
};
