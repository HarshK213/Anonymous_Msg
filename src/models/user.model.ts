import mongoose, { Schema, Document } from "mongoose";

interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExp: Date,
    isVerified: boolean,
    isAcceptingMsg: boolean,
    message: Message[],
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "UserName is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please use a valid email address"],
    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 20,
        required: true,
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExp: {
        type: Date,
        required: [true, "Verification code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true,
    },
    message: {
        type: [MessageSchema],
    }
})


// in Express we only use UserModel = mongooser.model("User",UserSchema)
// but as we know the next framework is edgetime framework, there are some times when connection is already established and user is already made so for this we user 
// mongoose.models.User --> if connection is already established and user is already made
// mongoose.model("User", UserSchema) in case when connection is made first time

// here as mongoose.Model<User> and mongoose.model<User> are typeScript injections just telling that the recieving model and making model are of User type.
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;