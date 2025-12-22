"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinValidation } from "@/schemas/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@react-email/components";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";



const Page = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signinValidation>>({
		resolver: zodResolver(signinValidation),
		defaultValues: {
		   	identifier: "",
		    password: "",
		},
	});

    const onSubmit = async(data: z.infer<typeof signinValidation>) => {
        // using nextAuth for sign in process
         const response = await signIn('credentials',{
             redirect: false,
             identifier: data.identifier,
             password: data.password,
         })

        console.log(response);

         if(response?.error){
             toast.error(response.error);
         }else{
             toast.success("Login successfully");
         }
    }


    return (
	    <div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
			    <div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
					    Log In Anonymous Message
					</h1>
					<p className="mb-4">
					    Sign in to start you anonymous adventure
					</p>
				</div>

				<Form {...form}>
				    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username or Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Username or Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait
                                        </>
                                    ) : ('Sign Up')
                                }
                            </Button>
					</form>
				</Form>
				<div className="text-center mt-4">
				    <p>
						New member?{' '}
						<Link href='sign-up' className="text-blue-600 hover:text-blue-800">
						    Sign Up
						</Link>
					</p>
				</div>
			</div>
	    </div>
	);
}

export default Page;