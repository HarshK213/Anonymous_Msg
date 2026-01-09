'use client'

import { useParams } from "next/navigation";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Send, User, MessageSquare, Shield } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

const Page = () => {
  const param = useParams<{ username: string }>();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notAccepting, setNotAccepting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please write a message before sending");
      return;
    }

    if (message.trim().length < 3) {
      toast.error("Message should be at least 3 characters long");
      return;
    }

    setIsSubmitting(true);
    setNotAccepting(false);

    try {
      const response = await axios.post("/api/send-message", {
        username: param.username,
        content: message,
      });

      const ansMessage = response.data.message;

      if (ansMessage === "User is not accepting any message") {
        setNotAccepting(true);
        toast.error(`${param.username} is not accepting messages currently`);
      } else if(ansMessage === "message send successfully"){
        toast.success("Your message has been sent anonymously!", {
          description: `${param.username} will see your message soon`,
        });
        setMessage("");
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 1000 - message.length;
  const isMessageTooLong = message.length > 1000;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-6 sm:py-8 md:py-12">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header Section */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 flex justify-center sm:mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:h-20 sm:w-20">
              <MessageSquare className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Send Anonymous Message
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <p className="text-sm sm:text-base">
              To: <span className="font-semibold text-primary">@{param.username}</span>
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <FieldSet>
              <FieldGroup className="space-y-6">
                {/* Message Field */}
                <Field>
                  <div className="mb-4">
                    <FieldLabel
                      htmlFor="message"
                      className="mb-3 block text-lg font-semibold text-gray-800 sm:text-xl"
                    >
                      Your Message
                    </FieldLabel>
                    <p className="text-sm text-gray-600 sm:text-base">
                      Share your thoughts anonymously. {param.username} won't know who sent this.
                    </p>
                  </div>

                  <div className="relative">
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="Type your message here... Share something nice, give feedback, or ask a question"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[180px] resize-y text-base focus:ring-2 focus:ring-primary/20 sm:min-h-[200px] sm:text-lg"
                      disabled={isSubmitting}
                      maxLength={1000}
                    />
                    
                    {/* Character Counter */}
                    <div className="mt-2 flex justify-end">
                      <span className={`text-xs sm:text-sm ${isMessageTooLong ? 'text-red-600' : remainingChars < 100 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {remainingChars} characters remaining
                      </span>
                    </div>

                    {notAccepting && (
                      <div className="mt-4 rounded-lg bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="mt-0.5 h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-semibold text-red-800">Messages Temporarily Disabled</p>
                            <p className="mt-1 text-sm text-red-700">
                              @{param.username} is not accepting messages at the moment. 
                              They may have disabled this feature temporarily.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Field>

                {/* Privacy Notice */}
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">Your Privacy is Protected</p>
                      <ul className="mt-2 space-y-1 text-sm text-blue-700 sm:text-base">
                        <li>• Your message is completely anonymous</li>
                        <li>• No personal information is shared</li>
                        <li>• You can't be identified as the sender</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !message.trim() || isMessageTooLong}
                  className="h-12 w-full text-base font-medium sm:h-14 sm:text-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin sm:h-6 sm:w-6" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                      <span>Send Message Anonymously</span>
                    </>
                  )}
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>

        {/* Tips & Guidelines */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 sm:text-xl">
            Message Guidelines
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4">
              <h4 className="mb-2 font-medium text-gray-700">👍 Do's</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Be kind and respectful</li>
                <li>• Share constructive feedback</li>
                <li>• Keep messages appropriate</li>
                <li>• Respect their privacy too</li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h4 className="mb-2 font-medium text-gray-700">👎 Don'ts</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Don't send spam or ads</li>
                <li>• Avoid hate speech</li>
                <li>• Don't reveal your identity</li>
                <li>• No harassment allowed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Message Examples */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Examples: "Great content!", "Loved your recent post about...", 
            "You're doing amazing work!"
          </p>
        </div>

        {/* Bottom Spacing for Mobile */}
        <div className="h-6 sm:h-8"></div>
      </div>
    </div>
  );
};

export default Page;