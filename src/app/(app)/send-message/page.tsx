"use client";

import { usernameSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    setIsCheckingUser(true);
    try {
      await axios.get(`/api/check-user/${username}`);
      router.replace(`/u/${username}`);
    } catch {
      setUsernameMessage("User not found");
      toast.error("User not found. Please check the username and try again.");
    } finally {
      setIsCheckingUser(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-4 flex justify-center sm:mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
              <User className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Find User to Message
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Enter the username of the person you want to send an anonymous
            message to
          </p>
        </div>

        {/* Form Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          placeholder="Enter username (e.g., john_doe)"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                            if (usernameMessage) setUsernameMessage("");
                          }}
                          className="h-12 pl-12 text-base sm:h-14 sm:text-lg"
                          disabled={isSubmitting}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          <User className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
                        </div>
                        {isCheckingUser && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-5 w-5 animate-spin text-primary sm:h-6 sm:w-6" />
                          </div>
                        )}
                      </div>
                    </FormControl>

                    {/* Username status message */}
                    {usernameMessage && (
                      <div
                        className={`mt-3 rounded-lg p-3 ${usernameMessage === "User found" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                      >
                        <p className="text-sm sm:text-base">
                          {usernameMessage}
                        </p>
                      </div>
                    )}

                    <FormMessage className="text-sm sm:text-base" />

                    <div className="mt-4 text-sm text-gray-500 sm:text-base">
                      <p>
                        Enter the exact username as it appears on their profile
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:gap-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !username.trim()}
                  className="h-12 w-full text-base font-medium sm:h-14 sm:flex-1 sm:text-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin sm:mr-4 sm:h-6 sm:w-6" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-5 w-5 sm:mr-4 sm:h-6 sm:w-6" />
                      <span>Find User</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setUsername("");
                    setUsernameMessage("");
                  }}
                  className="h-12 w-full text-base sm:h-14 sm:w-auto sm:px-8"
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Help Section */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-5 sm:mt-10 sm:p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800 sm:text-xl">
            How to find a user
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 sm:text-base">
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                1
              </div>
              <span>Ask the person for their exact username</span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                2
              </div>
              <span>Enter it exactly as they shared it (case sensitive)</span>
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                3
              </div>
              <span>
                Click &ldquo;Find User&rdquo; to navigate to their message page
              </span>
            </li>
          </ul>
        </div>

        {/* Example Usernames */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 sm:text-base">
            Example usernames:{" "}
            <code className="rounded bg-gray-100 px-2 py-1 text-sm">
              john_doe
            </code>
            ,
            <code className="mx-2 rounded bg-gray-100 px-2 py-1 text-sm">
              alice123
            </code>
            ,
            <code className="rounded bg-gray-100 px-2 py-1 text-sm">
              tech_guru
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
