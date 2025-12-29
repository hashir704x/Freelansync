import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import type { Dispatch, SetStateAction } from "react";
import { markProjectAsCompleted } from "@/api-functions/project-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ClientProjectCompletionDialog = ({
    openCompleteProjectDialog,
    setOpenCompleteProjectDialog,
    projectId,
}: {
    setOpenCompleteProjectDialog: Dispatch<SetStateAction<boolean>>;
    openCompleteProjectDialog: boolean;
    projectId: string;
}) => {
    const queryClient = useQueryClient();
    const { isPending, mutate } = useMutation({
        mutationFn: markProjectAsCompleted,
        onSuccess(response) {
            if (!response)
                toast.warning(
                    "Cannot mark project as completed as project have incomplete milestones."
                );
            else {
                toast.success("Project marked as completed");
                queryClient.invalidateQueries({
                    queryKey: ["get-project-details", projectId],
                });
            }
            setOpenCompleteProjectDialog(false);
        },
        onError(error) {
            toast.error(`Failed to mark project as completed: ${error.message}`);
        },
    });

    return (
        <AlertDialog
            open={openCompleteProjectDialog}
            onOpenChange={setOpenCompleteProjectDialog}
        >
            <AlertDialogTrigger asChild>
                <Button variant="custom" className="w-fit">
                    Mark Completed
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>Mark this project as completed?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure? This change is permanent and you will not be able to
                        work anymore on this project.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() => mutate({ projectId: projectId })}
                        disabled={isPending}
                        variant="custom"
                        className="bg-(--my-blue) hover:bg-(--my-blue-light) cursor-pointer"
                    >
                        {isPending && <Spinner />} Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientProjectCompletionDialog;
