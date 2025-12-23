import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { type Dispatch, type SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitMilestone } from "@/api-functions/milestone-functions";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const SubmitMilestoneDialog = ({
    openDialog,
    setOpenDialog,
    selectedFile,
    submissionDescription,
    projectTitle,
    clientId,
    freelancerUsername,
    projectId,
}: {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    selectedFile: File | null;
    submissionDescription: string;
    projectTitle: string;
    clientId: string;
    freelancerUsername: string;
    projectId: string;
}) => {
    const { milestoneId } = useParams();
    const queryClient = useQueryClient();

    const { isPending, mutate } = useMutation({
        mutationFn: submitMilestone,
        onSuccess() {
            toast.success("Milestone submitted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["get-milestone-details-by-id", milestoneId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-milestones-for-project", projectId],
            });

            setOpenDialog(false);
        },
        onError(error) {
            toast.error(`Failed to submit milestone: ${error.message}`);
            setOpenDialog(false);
        },
    });

    return (
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you really want to submit this milestone?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button
                        disabled={isPending}
                        variant="custom"
                        onClick={() =>
                            mutate({
                                milestoneId: milestoneId as string,
                                description: submissionDescription,
                                file: selectedFile,
                                projectTitle: projectTitle,
                                clientId: clientId,
                                freelancerUsername: freelancerUsername,
                                projectId: projectId,
                            })
                        }
                    >
                        {isPending && <Spinner />}Submit
                    </Button>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SubmitMilestoneDialog;
