"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyValidation } from "@/schemas/verify.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LucideIdCard } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod';

const VerifyCode = () => {
    const router = useRouter();

    // this string datatype giving in param is optional.
    const param = useParams < { username: string }>();

    const form = useForm<z.infer<typeof verifyValidation>>({
        resolver: zodResolver(verifyValidation),
        defaultValues:{
            code: "",
        }
    })

    const onSubmit = async(data : z.infer<typeof verifyValidation>) => {
        try{
            const response = await axios.post('/api/verify-code',{
                username: param.username,
                code : data.code
            })

            const ansMessage = response.data.message;

            toast.success(ansMessage);

            if(ansMessage === "Account Verified successfully"){
                router.push("/sign-in");
            }else if(ansMessage === "verification code has expired\nPlease signin again to get a new code"){
                router.push("/sign-up");
                console.log(ansMessage);
            }else if(ansMessage === "User has already verified"){
                router.push("/sign-in");
            }
        }catch(error){
            console.error("Error in signup of user",error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMsg = axiosError.response?.data.message;
            toast.error(errorMsg);
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
			    <div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
					    Verify your account
					</h1>
					<p className="mb-4">
					    Enter the verification code send to your email
					</p>
				</div>
				<Form {...form}>
				    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    					<FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Verify
                        </Button>
					</form>
				</Form>
			</div>
		</div>

    )
}

export default VerifyCode;