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
import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDispute } from "@/api-functions/dispute-functions";
import { toast } from "sonner";

type PropsType = {
    projectId: string;
    milestoneId: string;
};

const FreelancerDeleteDisputeDialog = ({ milestoneId, projectId }: PropsType) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: deleteDispute,
        onSuccess() {
            toast.success("Dispute deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-project-details", projectId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-milestone-details-by-id", milestoneId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-recent-milestones-for-user"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-milestones-for-project", projectId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-projects-for-freelancer"],
            });
            setOpen(false);
        },
        onError(error) {
            toast.error(`Failed to delete dispute: ${error.message}`);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-fit cursor-pointer">
                    <Trash2 /> Delete Dispute
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you really want to delete the dispute?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Deleting the dispute will unfreeze the project and project will
                        progress further.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() =>
                            mutate({ milestoneId: milestoneId, projectId: projectId })
                        }
                        disabled={isPending}
                        variant="destructive"
                        type="submit"
                        className="cursor-pointer"
                    >
                        {isPending && <Spinner />} Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FreelancerDeleteDisputeDialog;
