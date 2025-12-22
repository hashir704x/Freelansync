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
import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMilestoneSubmission } from "@/api-functions/milestone-functions";
import { toast } from "sonner";

const DeleteMilestoneSubmissionDialog = ({
    milestoneId,
    setSelectedFile,
    setSubmissionDescription,
}: {
    milestoneId: string;
    setSelectedFile: Dispatch<SetStateAction<File | null>>;
    setSubmissionDescription: Dispatch<SetStateAction<string>>;
}) => {
    const queryClient = useQueryClient();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: deleteMilestoneSubmission,
        onSuccess() {
            toast.success("Submission deleted successfully");
            setSelectedFile(null);
            setSubmissionDescription("");
            queryClient.invalidateQueries({
                queryKey: ["get-milestone-details-by-id", milestoneId],
            });
            setOpenDeleteDialog(false);
        },
        onError(error) {
            toast.error(`Failed to delete submission: ${error.message}`);
        },
    });
    return (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer">
                    Delete Submission
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you really want to delete this submission?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button
                        onClick={() => mutate(milestoneId)}
                        disabled={isPending}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        {isPending && <Spinner />} Delete
                    </Button>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMilestoneSubmissionDialog;
