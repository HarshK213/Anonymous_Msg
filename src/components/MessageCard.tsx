'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X, Calendar, User, Mail } from "lucide-react"
import { Message } from "@/models/user.model"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Badge } from "./ui/badge"
import { format } from "date-fns"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    const msgId = String(message._id);
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${msgId}`);
      toast.success(response.data.message || "Message deleted successfully");
      onMessageDelete(msgId);
    } catch (error) {
      toast.error("Failed to delete message");
    }
  }

  // Format date if createdAt exists
  const formattedDate = message.createdAt 
    ? format(new Date(message.createdAt), "PPP 'at' p")
    : "Unknown date";

  return (
      <Card className="w-full max-w-lg mx-auto shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Anonymous Message</CardTitle>
              <CardDescription>Received from anonymous user</CardDescription>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  aria-label="Delete message"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message? This action cannot be undone.
                    The message from anonymous user will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Message
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
      
        <CardContent className="pt-2">
          <div className="space-y-4">
            <div className="flex items-center">
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1.5 text-xs"
              >
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </Badge>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg border">
              {message.content ? (
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              ) : (
                <p className="text-muted-foreground italic">No message content</p>
              )}
            </div>
          </div>
        </CardContent>
      
        <CardFooter className="pt-2 border-t">
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-xs">Message ID:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {message._id?.toString().slice(-8) || "N/A"}
              </code>
            </div>
            <div className="text-xs">
              {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : "Unknown time"}
            </div>
          </div>
        </CardFooter>
      </Card>
  )
}

export default MessageCard