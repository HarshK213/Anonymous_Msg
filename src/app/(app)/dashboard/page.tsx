'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";

import { Message } from "@/models/user.model";
import { acceptMsgValidation } from "@/schemas/acceptMsg.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, RefreshCcw, Copy, Eye, EyeClosed } from "lucide-react";

import axios from "axios";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";

const Page = () => {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [showPass, setShowPass] = useState(false);

  const form = useForm({
    resolver: zodResolver(acceptMsgValidation),
    defaultValues: { acceptMsg: false },
  });

  const { control, setValue } = form;

  /* ---------------- FETCH ACCEPT MESSAGE STATUS ---------------- */
  const fetchAcceptMsg = useCallback(async () => {
    try {
      setSwitchLoading(true);
      const res = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMsg", res.data.data?.isAcceptingMsg || false);
    } catch {
      toast.error("Failed to fetch message status");
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  /* ---------------- FETCH MESSAGES ---------------- */
  const fetchMessages = useCallback(async (showToast = false) => {
    try {
        setIsLoading(true);
        const res = await axios.get<ApiResponse>("/api/get-message");
        setMessages(res.data.data?.messages || []);
        if (showToast) toast.success("Messages refreshed");
    } catch {
        toast.error("Failed to fetch messages");
    } finally {
        setIsLoading(false);
    }
  }, []);

  /* ---------------- DELETE MESSAGE ---------------- */
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((msg) => String(msg._id) !== messageId)
    );
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!session?.user) return;

    fetchMessages();
    fetchAcceptMsg();

    const base = window.location.origin;
    setProfileUrl(`${base}/u/${(session.user as User).username}`);
  }, [session, fetchMessages, fetchAcceptMsg]);

  /* ---------------- AUTH STATES ---------------- */
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold">Access Required</h2>
          <p className="mb-6 text-muted-foreground">Please login to access your dashboard</p>
          <Button className="w-full sm:w-auto">Go to Login</Button>
        </div>
      </div>
    );
  }

  /* ---------------- COPY LINK ---------------- */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard!");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage your messages and profile settings
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile & Settings */}
          <div className="lg:col-span-1">
            {/* Profile Link Card */}
            <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-800 sm:text-xl">
                Your Public Profile
              </h2>
              <p className="mb-4 text-sm text-gray-600 sm:text-base">
                Share this link to receive anonymous messages
              </p>
              
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <input
                    value={profileUrl}
                    disabled
                    className="h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 pr-12 text-sm font-mono text-gray-700 sm:text-base"
                  />
                  <Button
                    onClick={() => setShowPass(!showPass)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2"
                  >
                    {showPass ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeClosed className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="h-12 px-4 sm:px-6"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
              </div>
            </div>

            {/* Settings Card */}
            <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
                Message Settings
              </h2>
              
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="font-medium text-gray-800">Accept Messages</p>
                  <p className="text-sm text-gray-600">
                    Allow others to send you messages
                  </p>
                </div>
                <Controller
                  name="acceptMsg"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      disabled={switchLoading}
                      onCheckedChange={async (checked) => {
                        try {
                          setSwitchLoading(true);
                          const res = await axios.post<ApiResponse>(
                            "/api/accept-message",
                            { acceptMessage: checked }
                          );
                          field.onChange(checked);
                          toast.success(res.data.message);
                        } catch {
                          toast.error("Failed to update status");
                        } finally {
                          setSwitchLoading(false);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Messages */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-5 md:p-6">
              {/* Messages Header */}
              <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Messages
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 sm:text-base">
                    {messages.length} message{messages.length !== 1 ? 's' : ''} received
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => fetchMessages(true)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="mr-2 h-4 w-4" />
                  )}
                  Refresh Messages
                </Button>
              </div>

              <Separator className="mb-6" />

              {/* Messages Grid */}
              {messages.length > 0 ? (
                <div className="grid gap-4 sm:gap-5 md:gap-6">
                  {messages.map((msg) => (
                    <MessageCard
                      key={String(msg._id)}
                      message={msg}
                      onMessageDelete={handleDeleteMessage}
                      // className="transition-all duration-200 hover:shadow-md"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center sm:p-12">
                  <div className="mb-4 rounded-full bg-gray-100 p-4">
                    <RefreshCcw className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">
                    No messages yet
                  </h3>
                  <p className="max-w-md text-sm text-gray-500 sm:text-base">
                    When you receive messages, they will appear here. Share your profile link to start receiving messages.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={copyToClipboard}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Profile Link
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Padding */}
        <div className="h-8 sm:h-12 lg:hidden"></div>
      </div>
    </div>
  );
};

export default Page;