"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyValidation } from "@/schemas/verify.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LucideIdCard, Mail, Key, CheckCircle, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod';

const VerifyCode = () => {
    const router = useRouter();
    const param = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const form = useForm<z.infer<typeof verifyValidation>>({
        resolver: zodResolver(verifyValidation),
        defaultValues: {
            code: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof verifyValidation>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code
            });

            const ansMessage = response.data.message;

            toast.success(ansMessage);

            if (ansMessage === "Account Verified successfully") {
                toast.success("Account verified! Redirecting to login...");
                setTimeout(() => router.push("/sign-in"), 1500);
            } else if (ansMessage.includes("verification code has expired")) {
                toast.error("Code expired. Please request a new one.");
                router.push("/sign-up");
            } else if (ansMessage === "User has already verified") {
                toast.info("Account already verified. Redirecting to login...");
                setTimeout(() => router.push("/sign-in"), 1500);
            }
        } catch (error) {
            console.error("Error in verifying code", error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message;
            toast.error(errorMsg || "Verification failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            const response = await axios.post('/api/resend-verification', {
                username: param.username
            });
            toast.success("New verification code sent to your email!");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 px-4 py-8 sm:py-12 md:py-16">
            <div className="mx-auto w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center sm:mb-12">
                    <div className="mb-4 flex justify-center sm:mb-6">
                        <div className="relative">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <LucideIdCard className="h-8 w-8 text-primary" />
                            </div>
                            <div className="absolute -right-2 -bottom-2 rounded-full bg-secondary p-2">
                                <CheckCircle className="h-4 w-4 text-secondary-foreground" />
                            </div>
                        </div>
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Verify Your Account
                    </h1>
                    <p className="text-base text-gray-600 sm:text-lg">
                        Enter the verification code sent to your email
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                            @{param.username}
                        </span>
                    </div>
                </div>

                {/* Verification Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Code Field */}
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 sm:text-base">
                                            6-Digit Verification Code
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter 6-digit code"
                                                    {...field}
                                                    className="h-12 pl-12 text-center text-2xl tracking-widest"
                                                    maxLength={6}
                                                    disabled={isSubmitting}
                                                    onChange={(e) => {
                                                        // Allow only numbers
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                                    <Key className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                        <div className="mt-2 text-xs text-gray-500">
                                            Enter the 6-digit code exactly as shown in the email
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Instructions */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 text-gray-500" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Important Notes</h4>
                                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                            <li>• Check your email spam folder if you can't find the code</li>
                                            <li>• The code expires in 15 minutes</li>
                                            <li>• Enter the code exactly as shown (numbers only)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !form.watch('code') || form.watch('code').length !== 6}
                                    className="h-12 flex-1 text-base font-medium"
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <CheckCircle className="mr-3 h-5 w-5 animate-pulse" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-3 h-5 w-5" />
                                            Verify Account
                                            <ArrowRight className="ml-3 h-5 w-5" />
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                    className="h-12 sm:w-auto"
                                >
                                    {isResending ? (
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-5 w-5" />
                                            Resend Code
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    {/* Code Format Example */}
                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h4 className="mb-3 text-sm font-medium text-gray-700">Code Format Example:</h4>
                        <div className="flex gap-2">
                            {['1', '2', '3', '4', '5', '6'].map((digit, index) => (
                                <div
                                    key={index}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-lg font-medium text-gray-700"
                                >
                                    {digit}
                                </div>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            Your code will look like this (6 digits, numbers only)
                        </p>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">Need Help?</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                                1
                            </div>
                            <span>Check your email inbox for a message from us</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                                2
                            </div>
                            <span>Look in your spam/junk folder if you don't see it</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                                3
                            </div>
                            <span>Click "Resend Code" if you didn't receive it</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                                4
                            </div>
                            <span>Make sure you're using the correct email address</span>
                        </div>
                    </div>
                </div>

                {/* Back to Sign Up */}
                <div className="mt-6 text-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/sign-up')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Sign Up
                    </Button>
                </div>

                {/* Mobile Bottom Spacing */}
                <div className="h-8 sm:h-12"></div>
            </div>
        </div>
    )
}

export default VerifyCode;