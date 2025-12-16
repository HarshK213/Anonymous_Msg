import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { success, z } from 'zod';
import { usernameValidation } from "@/schemas/signup.schema";

const userNameValidSchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { seachParams } = new URL(request.url);
        const queryParams = {
            username: seachParams.get('username')
        }
    } catch (error) {
        console.error("Error checking username : ", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            }, {
            status: 500
        }
        )
    }
}