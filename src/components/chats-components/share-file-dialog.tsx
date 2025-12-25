import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { uploadChatMedia } from "@/api-functions/chats-functions";
import { toast } from "sonner";

type PropsType = {
    openShareFileDialog: boolean;
    setOpenShareFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
    targetFile: File;
    setTargetFile: React.Dispatch<React.SetStateAction<File | null>>;
    activeChatId: string;
};

const ShareFileDialog = (props: PropsType) => {
    const user = userStore((state) => state.user) as UserType;

    const { mutate, isPending } = useMutation({
        mutationFn: uploadChatMedia,
        onSuccess() {
            props.setTargetFile(null);
            props.setOpenShareFileDialog(false);
            toast.success("File shared successfully!");
            
        },
        onError(error) {
            toast.error(`Failed to share file: ${error.message}`);
        },
    });

    return (
        <AlertDialog
            open={props.openShareFileDialog}
            onOpenChange={props.setOpenShareFileDialog}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to share this file?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="secondary"
                        onClick={() => {
                            props.setTargetFile(null);
                            props.setOpenShareFileDialog(false);
                        }}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="custom"
                        disabled={isPending}
                        onClick={() =>
                            mutate({
                                file: props.targetFile,
                                chatId: props.activeChatId,
                                senderId: user.id,
                                senderRole: user.role,
                            })
                        }
                    >
                        {isPending && <Spinner />} Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ShareFileDialog;
