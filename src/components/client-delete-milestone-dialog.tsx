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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { deleteMilestone } from "@/api-functions/milestone-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ClientDeleteMilestoneDialog = ({
    milestoneId,
    projectId,
    milestoneAmount,
}: {
    milestoneId: string;
    projectId: string;
    milestoneAmount: number;
}) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteMilestone,
        onSuccess() {
            toast.success("Milestone deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-milestone-details-by-id", milestoneId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-recent-milestones-for-user"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-milestones-for-project", projectId],
            });

            setOpen(false);
            navigate(`/client/project-details/${projectId}`, { replace: true });
        },
        onError(error) {
            toast.error(`Failed to delete milestone: ${error.message}`);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild className="mt-5">
                <Button variant="destructive" className="w-fit cursor-pointer">
                    <Trash2 /> Delete Milestone
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you really want to delete this milestone?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Deleting the milestone will move the funds back to your project
                        funds.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() =>
                            mutate({
                                milestoneId: milestoneId,
                                milestoneAmount: milestoneAmount,
                                projectId: projectId,
                            })
                        }
                        disabled={isPending}
                        variant="destructive"
                        type="submit"
                        className="cursor-pointer"
                    >
                        {isPending && <Spinner />} Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientDeleteMilestoneDialog;
