"use client";

import { usernameSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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

    const onSubmit = async (data: z.infer<typeof usernameSchema>) => {
        setIsSubmitting(true);
        setIsCheckingUser(true);
        try {
            const response = await axios.get(`api/check-user/${username}`);
            router.replace(`/u/${username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage("User not found");
        }finally{
            setIsCheckingUser(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center pt-20 gap-6">
        <p className="font-extrabold text-4xl">
            Enter the user to which you want to send the message.
        </p>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex justify-center gap-10">
            <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        placeholder="Username"
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                        }}
                    />
                    </FormControl>
                    {isCheckingUser && <Loader2 className="animate-spin"/>}
                    <p  className={`text-sm ${usernameMessage === "User not found " ? 'text-green-500' : 'text-red-500'}`}>
                        {usernameMessage}
                    </p>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                </>
                ) : (
                "Enter"
                )}
            </Button>
            </form>
        </Form>
        </div>
    );
};

export default Page;
