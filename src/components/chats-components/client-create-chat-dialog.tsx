import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewChatByClient } from "@/api-functions/chats-functions";
import { toast } from "sonner";

type PropsType = {
    openCreateChatDialog: boolean;
    setOpenCreateChatDialog: React.Dispatch<React.SetStateAction<boolean>>;
    freelancerName: string;
    freelancerId: string;
    clientId: string;
};

const ClientCreateChatDialog = (props: PropsType) => {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: createNewChatByClient,
        onSuccess() {
            props.setOpenCreateChatDialog(false);
            setMessage("");
            queryClient.invalidateQueries({
                queryKey: ["get-all-chats-for-user"],
            });
            toast.success("Message sent successfully, you can view chat in chats page");
        },
        onError(error) {
            toast.error(`Failed to send message chat: ${error.message}`);
        },
    });

    return (
        <AlertDialog
            open={props.openCreateChatDialog}
            onOpenChange={props.setOpenCreateChatDialog}
        >
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-(--my-blue)">
                        <MessageCircle className="w-5 h-5" />
                        Message {props.freelancerName}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Write your message below and send it directly to the freelancer.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-3">
                    <Textarea
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px] resize-none border-gray-200 focus-visible:ring-(--my-blue)"
                    />
                </div>

                <AlertDialogFooter className="flex justify-between mt-5">
                    <AlertDialogCancel className="rounded-lg px-5 py-2">
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        onClick={() =>
                            mutate({
                                message: message,
                                clientId: props.clientId,
                                freelancerId: props.freelancerId,
                            })
                        }
                        disabled={isPending || !message.trim()}
                        className="flex items-center gap-2 bg-(--my-blue) hover:bg-(--my-blue-light) px-5 py-2 rounded-lg"
                    >
                        {isPending ? <Spinner /> : <SendHorizonal className="w-4 h-4" />}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientCreateChatDialog;
