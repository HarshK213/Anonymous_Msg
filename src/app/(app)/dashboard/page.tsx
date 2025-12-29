'use client'

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/user.model";
import { acceptMsgValidation } from "@/schemas/acceptMsg.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import MessageCard from "@/components/MessageCard"
import { User } from "next-auth";

const Page = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [switchLoading, setSwitchLoading] = useState(false);

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => String(message._id) !== messageId))
    }
    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMsgValidation)
    })

    const { register, watch, setValue } = form;

    const acceptMsg = watch('acceptMsg');

    const fetchAcceptMsg = useCallback(async()=>{
        setSwitchLoading(true);
        try{
            const response = await axios.get('/api/accept-message');
            setValue('acceptMsg', response.data.isAcceptingMsg);
            console.log(acceptMsg);
        }catch(error){
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("error while fetching accept message in dashboard")
        }finally{
            setSwitchLoading(false);
        }
    },[setValue])

    const fetchMsg = useCallback(async (refresh: boolean = true) => {
        setIsLoading(true);
        setSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get=message');
            setMessages(response.data.messages || []);
            if (refresh) {
                toast('showing latest message');
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log(axiosError)
            toast.error("error while fetching messages in dashboard")
        } finally{
            setIsLoading(false);
            setSwitchLoading(false);
        }
    },[setIsLoading, setMessages])

    useEffect(() => {
        if(!session || !session.user)return
        fetchMsg();
        fetchAcceptMsg();
    }, [session, setValue, fetchAcceptMsg, fetchMsg])

    const handleSwitchChange = async() => {
        try{
            const response = await axios.post<ApiResponse>('/api/accept-message',{
                acceptMessage: !acceptMsg,
            })
            setValue('acceptMsg', !acceptMsg);
            toast.warning(response.data.message);
        }catch(error){
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("error while changing state of accepting message in dashboard")
        }
    }

    if (status === "loading") {
      return <div>Loading...</div>;
    }
    
    if (status === "unauthenticated") {
      return <div>Please Login</div>;
    }
    
    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Profile URL copied successfully");
    }

    
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
              <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="input input-bordered w-full p-2 mr-2"
                  />
                  <Button onClick={copyToClipboard}>Copy</Button>
                </div>
              </div>

              <div className="mb-4">
                <Switch
                  {...register('acceptMsg')}
                  checked={acceptMsg}
                  onCheckedChange={handleSwitchChange}
                  disabled={switchLoading}
                />
                <span className="ml-2">
                  Accept Messages: {acceptMsg ? 'On' : 'Off'}
                </span>
              </div>
              <Separator />

              <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMsg(true);
                }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <MessageCard
                      key={String(message._id)}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))
                ) : (
                  <p>No messages to display.</p>
                )}
              </div>
            </div>
    )
}

export default Page;