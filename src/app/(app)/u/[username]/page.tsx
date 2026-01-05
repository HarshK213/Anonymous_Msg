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
import { Loader2 } from "lucide-react";
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
      toast.error("Message cannot be empty");
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
    console.log(ansMessage);

      if (ansMessage === "User is not accepting any message") {
        setNotAccepting(true);
      } else if(ansMessage === ""){
        toast.success("Message sent successfully");
        setMessage("");
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">

        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
          Public Profile Link
        </h1>

        <form onSubmit={onSubmit}>
          <FieldSet>
            <FieldGroup className="space-y-6">

              <Field className="flex flex-col gap-2">
                <FieldLabel
                  htmlFor="feedback"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Feedback
                </FieldLabel>

                <Textarea
                  id="feedback"
                  rows={6}
                  placeholder="Your feedback helps us improve..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none rounded-lg"
                />

                {notAccepting && (
                  <p className="text-sm font-semibold text-red-600">
                    {param.username} is not accepting messages currently.
                  </p>
                )}
              </Field>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>

            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  );
};

export default Page;