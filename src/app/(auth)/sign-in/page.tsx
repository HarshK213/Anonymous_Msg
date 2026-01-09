"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinValidation } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2, Lock, Mail, User, LogIn, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleSignIn, handleSignOut } from "@/lib/auth";

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signinValidation>>({
        resolver: zodResolver(signinValidation),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signinValidation>) => {
        setIsSubmitting(true);
        try {
            const response = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (response?.error) {
                toast.error("Login failed. Please check your credentials.");
            } else {
                toast.success("Welcome back! Login successful.");
                router.replace("/dashboard");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 py-8 sm:py-12 md:py-16">
            <div className="mx-auto w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center sm:mb-12">
                    <div className="mb-4 flex justify-center sm:mb-6">
                        <div className="relative">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <Lock className="h-8 w-8 text-primary" />
                            </div>
                            <div className="absolute -right-2 -bottom-2 rounded-full bg-secondary p-2">
                                <User className="h-4 w-4 text-secondary-foreground" />
                            </div>
                        </div>
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Welcome Back
                    </h1>
                    <p className="text-base text-gray-600 sm:text-lg">
                        Sign in to continue your anonymous journey
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email/Username Field */}
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">
                                            Email or Username
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your email or username"
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
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">
                                                Password
                                            </FormLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPass ? "text" : "password"}
                                                    placeholder="Enter your password"
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
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 w-full text-base font-medium"
                                size="lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-3 h-5 w-5" />
                                        Sign In
                                        <ArrowRight className="ml-3 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 text-sm text-gray-500">or continue with</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11"
                            onClick={handleSignIn}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11"
                            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                                />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                </div>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-primary hover:underline"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>

                {/* Security Notice */}
                <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-center">
                    <p className="text-sm text-blue-700">
                        <Lock className="mr-2 inline h-4 w-4" />
                        Your login is secure and encrypted. We never share your data.
                    </p>
                </div>
            </div>

            {/* Mobile Bottom Spacing */}
            <div className="h-8 sm:h-12"></div>
        </div>
    );
};

export default Page;