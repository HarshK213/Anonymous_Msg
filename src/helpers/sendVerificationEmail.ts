import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "MysteryMsg <no-reply@verify.harshk.online>",
      to: email,
      subject: "Anonymous Msg | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (error) {
    console.log("Error while sending verification email : ", error);
    return {
      success: false,
      message: "Failed to send Verification email",
    };
  }
};

export { sendVerificationEmail };
