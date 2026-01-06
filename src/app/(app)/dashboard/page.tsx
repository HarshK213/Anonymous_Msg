'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";

import { Message } from "@/models/user.model";
import { acceptMsgValidation } from "@/schemas/acceptMsg.schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2, RefreshCcw } from "lucide-react";

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
        console.log(res);
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
        console.log(res);
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
    return <div className="p-6">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="p-6">Please login</div>;
  }

  /* ---------------- COPY LINK ---------------- */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="mx-auto my-8 w-full max-w-6xl rounded-lg bg-white p-6">
      <h1 className="mb-6 text-4xl font-bold">User Dashboard</h1>

      {/* Profile Link */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Your Public Link</h2>
        <div className="flex gap-2">
          <input
            value={profileUrl}
            disabled
            className="w-full rounded border p-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-6 flex items-center gap-3">
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
                  console.log(res.data)
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
        <span>Accept Messages</span>
      </div>

      <Separator />

      {/* Refresh */}
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => fetchMessages(true)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* Messages */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCard
              key={String(msg._id)}
              message={msg}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
