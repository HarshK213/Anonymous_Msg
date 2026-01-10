import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

type User = {
  id: string;
  _id: string;
  email: string;
  name: string;
  username: string;
  isVerified: boolean;
  isAcceptingMsg: boolean;
  providers: string[];
  providerIds: Map<string, string>;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        await dbConnect();

        if (!credentials) return null;

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
            providers: { $in: ["credentials"] },
          });

          if (!user) throw new Error("No user found with this email");

          if (!user.isVerified)
            throw new Error("Please verify your account before login");

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) throw new Error("Incorrect Password");

          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            name: user.username,
            username: user.username,
            isVerified: user.isVerified,
            isAcceptingMsg: user.isAcceptingMsg,
            providers: user.providers,
            providerIds: user.providerIds,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An unexpected error occurred");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        console.log("Google Profile:", {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified,
          locale: profile.locale,
          givenName: profile.given_name,
          familyName: profile.family_name,
          // Raw profile for debugging
          rawProfile: profile,
        });

        return {
          id: profile.sub,
          _id: profile.sub,
          email: profile.email,
          name: profile.name,
          username: profile.name,
          isVerified: profile.email_verified === "true",
          isAcceptingMsg: false,
          providers: ["google"],
          providerIds: new Map([["google", profile.sub]]),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      if (account?.provider === "google") {
        try {
          const googleId = account.providerAccountId;

          // Check if user exists by Google ID
          const existingUserByGoogleId = await UserModel.findOne({
            "providerIds.google": googleId,
          });

          if (existingUserByGoogleId) {
            // User exists with this Google account
            user.id = existingUserByGoogleId._id.toString();
            return true;
          }

          // Check if user exists by email
          const existingUserByEmail = await UserModel.findOne({
            email: user.email,
          });

          if (existingUserByEmail) {
            // Link Google provider to existing account
            if (!existingUserByEmail.providers.includes("google")) {
              existingUserByEmail.providers.push("google");
            }

            // Store Google ID in providerIds map
            existingUserByEmail.providerIds.set("google", googleId);

            // Update profile image if not set
            if (!existingUserByEmail.image && user.image) {
              existingUserByEmail.image = user.image;
            }

            await existingUserByEmail.save();
            user.id = existingUserByEmail._id.toString();

            console.log(
              `Linked Google account to existing user: ${user.email}`
            );
            return true;
          }

          // Create new user for Google signup
          const baseUsername =
            user.email?.split("@")[0] || `user_${Date.now()}`;
          let username = baseUsername;
          let counter = 1;

          while (await UserModel.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          const newUser = await UserModel.create({
            username,
            email: user.email,
            name: user.name,
            isVerified: true,
            isAcceptingMsg: true,
            providers: ["google"],
            providerIds: new Map([["google", googleId]]),
            messages: [],
          });

          user.id = newUser._id.toString();
          console.log(`Created new Google user: ${user.email}`);
          return true;
        } catch (error) {
          console.error("Error in Google signin:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username || user.name;
        token.providers = user.providers || ["credentials"];
        token.providerIds = user.providerIds || new Map();
        token.isVerified = user.isVerified;
        token.isAcceptingMsg = user.isAcceptingMsg;

        // Add current provider
        if (account) {
          token.currentProvider = account.provider;
        }
      }

      // Fetch fresh user data
      if (token.email) {
        await dbConnect();
        const dbUser = await UserModel.findOne({ email: token.email });
        if (dbUser) {
          token.isAcceptingMsg = dbUser.isAcceptingMsg;
          token.username = dbUser.username;
          token.providers = dbUser.providers;
          token.providerIds = dbUser.providerIds;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.username = token.username as string;
        session.user.providers = token.providers as string[];
        session.user.providerIds = token.providerIds as Map<string, string>;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMsg = token.isAcceptingMsg as boolean;
        session.user.currentProvider = token.currentProvider as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
