// 'use client'
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "./ui/button"
// import { X } from "lucide-react"
// import {Message} from "@/models/user.model"
// import axios from "axios"
// import { ApiResponse } from "@/types/ApiResponse"
// import { toast } from "sonner"

// type MessageCardProps = {
//     message: Message;
//     onMessageDelete: (messageId: string) => void
// }

// const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

//     const handleDeleteConfirm = async() => {
//         const msgId = String(message._id);
//         const response = await axios.delete<ApiResponse>(`/api/delete-message/${msgId}`);
//         toast.warning(response.data.message);
//         onMessageDelete(msgId);
//     }

//     return (
//         <Card>
//           <CardHeader>
//             <CardTitle>Card Title</CardTitle>

//             <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant="destructive"><X className="w-5 h-5"/></Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This action cannot be undone. This will permanently delete your
//                         account and remove your data from our servers.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>

//             <CardDescription>Card Description</CardDescription>
//             <CardAction>Card Action</CardAction>
//           </CardHeader>
//           <CardContent>
//               <p>{message}</p>
//           </CardContent>
//           <CardFooter>
//             <p>Card Footer</p>
//           </CardFooter>
//         </Card>
//     )
// }

// export default MessageCard;

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
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            {message.username || "Anonymous"}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            {message.email || "No email provided"}
          </CardDescription>
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
                The message from {message.username || "anonymous user"} will be permanently removed.
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
      </CardHeader>

      <CardContent className="pt-4">
        <div className="mb-4">
          <Badge 
            variant="outline" 
            className="mb-2 flex items-center gap-1 w-fit text-xs"
          >
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </Badge>
          
          {message.content ? (
            <div className="mt-2 p-3 bg-muted/40 rounded-lg border">
              <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No message content</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-xs">Message ID:</span>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {message._id?.toString().slice(-8) || "N/A"}
          </code>
        </div>
        {/*<div className="text-xs">
          {message.isViewed ? (
            <Badge variant="outline" className="text-green-600 border-green-200">
              Viewed
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              Unread
            </Badge>
          )}
        </div>*/}
      </CardFooter>
    </Card>
  )
}

export default MessageCard