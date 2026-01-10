// import mongoose, { Schema, Document } from "mongoose";

// export interface Message extends Document {
//   content: string;
//   createdAt: Date;
// }
//
// interface User extends Document {
//   username: string;
//   email: string;
//   password: string;
//   verifyCode: string;
//   verifyCodeExp: Date;
//   isVerified: boolean;
//   isAcceptingMsg: boolean;
//   message: Message[];
// }

// const UserSchema: Schema<User> = new Schema({
//   username: {
//     type: String,
//     required: [true, "UserName is required"],
//     trim: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [
//       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//       "please use a valid email address",
//     ],
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   verifyCode: {
//     type: String,
//     required: [true, "Verify code is required"],
//   },
//   verifyCodeExp: {
//     type: Date,
//     required: [true, "Verification code expiry is required"],
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   isAcceptingMsg: {
//     type: Boolean,
//     default: true,
//   },
//   message: {
//     type: [MessageSchema],
//   },
// });

// // in Express we only use UserModel = mongooser.model("User",UserSchema)
// // but as we know the next framework is edgetime framework, there are some times when connection is already established and user is already made so for this we user
// // mongoose.models.User --> if connection is already established and user is already made
// // mongoose.model("User", UserSchema) in case when connection is made first time

// // here as mongoose.Model<User> and mongoose.model<User> are typeScript injections just telling that the recieving model and making model are of User type.
// const UserModel =
//   (mongoose.models.User as mongoose.Model<User>) ||
//   mongoose.model<User>("User", UserSchema);

// export default UserModel;

import mongoose, { Document, Schema } from "mongoose";

export interface Message {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password?: string;
  verifyCode?: string;
  verifyCodeExp?: Date;
  isVerified: boolean;
  isAcceptingMsg: boolean;
  messages: Message[];
  providers?: string[];
  providerIds?: Map<string,string>;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExp: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMsg: {
      type: Boolean,
      default: true,
    },
    messages: [
      {
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    providers: {
       type: [String],
       enum: ["credentials", "google", "github"],
       default: ["credentials"], // Default to credentials if created via email/password
     },
     providerIds: {
       type: Map,
       of: String,
       default: new Map(),
     },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
