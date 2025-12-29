import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useMutation } from "@tanstack/react-query";
import { uploadGroupChatMedia } from "@/api-functions/project-functions";
import { toast } from "sonner";

type PropsType = {
    openProjectChatShareFileDialog: boolean;
    setOpenProjectChatShareFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
    targetFile: File;
    setTargetFile: React.Dispatch<React.SetStateAction<File | null>>;
    projectId: string;
};

const ProjectChatShareFileDialog = (props: PropsType) => {
    const user = userStore((state) => state.user) as UserType;
    const { isPending, mutate } = useMutation({
        mutationFn: uploadGroupChatMedia,
        onSuccess() {
            props.setTargetFile(null);
            props.setOpenProjectChatShareFileDialog(false);
            toast.success("File shared successfully!");
        },
        onError(error) {
            toast.error(`Failed to share file: ${error.message}`);
        },
    });
    return (
        <AlertDialog
            open={props.openProjectChatShareFileDialog}
            onOpenChange={props.setOpenProjectChatShareFileDialog}
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
                            props.setOpenProjectChatShareFileDialog(false);
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
                                projectId: props.projectId,
                                senderId: user.id,
                                senderUsername: user.username,
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

export default ProjectChatShareFileDialog;
