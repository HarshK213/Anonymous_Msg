"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupValidation } from "@/schemas/signup.schema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeClosed,
  Loader2,
  User,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast.success(response.data.message, {
        description: "Please check your email to verify your account.",
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg = axiosError.response?.data.message;
      toast.error(errorMsg || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUsernameAvailable = usernameMessage === "username is unique";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 py-8 sm:py-12 md:py-16">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-4 flex justify-center sm:mb-6">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -right-2 -bottom-2 rounded-full bg-secondary p-2">
                <Lock className="h-4 w-4 text-secondary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Join Anonymous Messaging
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            Create your account to start sending and receiving anonymous
            messages
          </p>
        </div>

        {/* Signup Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Choose a username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          className="h-12 pl-12 text-base"
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    {username && (
                      <div className="mt-2 flex items-center gap-2">
                        {isCheckingUsername ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            <span className="text-sm text-gray-500">
                              Checking availability...
                            </span>
                          </>
                        ) : (
                          <>
                            {isUsernameAvailable ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={`text-sm ${isUsernameAvailable ? "text-green-600" : "text-red-600"}`}
                            >
                              {usernameMessage}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    <FormMessage />
                    <div className="mt-1 text-xs text-gray-500">
                      This will be your public profile name
                    </div>
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                          className="h-12 pl-12 text-base"
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="mt-1 text-xs text-gray-500">
                      We&apos;ll send a verification email to this address
                    </div>
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder="Create a strong password"
                          {...field}
                          className="h-12 pl-12 pr-12 text-base"
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                          disabled={isSubmitting}
                        >
                          {showPass ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeClosed className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="mt-2 text-xs text-gray-500">
                      Use at least 8 characters with letters and numbers
                    </div>
                  </FormItem>
                )}
              />

              {/* Terms Agreement */}
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    By creating an account, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    . Your messages will remain anonymous.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isUsernameAvailable}
                className="h-12 w-full text-base font-medium"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="mr-3 h-5 w-5" />
                    Create Account
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-sm text-gray-500">
              Already have an account?
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              href="/sign-in"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Sign in to existing account
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">
                  Completely Anonymous
                </h4>
                <p className="text-xs text-green-700">
                  Your identity stays hidden
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">End-to-End Secure</h4>
                <p className="text-xs text-blue-700">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-8 sm:h-12"></div>
      </div>
    </div>
  );
};

export default Page;
