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
import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { createDispute } from "@/api-functions/dispute-functions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PropsType = {
    projectId: string;
    freelancerId: string;
    clientId: string;
    milestoneId: string;
    freelancerUsername: string;
    projectTitle: string;
};

const FreelancerRaiseDisputeDialog = ({
    clientId,
    freelancerId,
    milestoneId,
    projectId,
    freelancerUsername,
    projectTitle,
}: PropsType) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [disputeDescription, setDisputeDescription] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: createDispute,
        onSuccess() {
            toast.success(
                "Dispute raised successfully, the project and milestone is now freezed"
            );
            setDisputeDescription("");
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
            toast.error(`Failed to raise dispute: ${error.message}`);
        },
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        mutate({
            clientId: clientId,
            freelancerId: freelancerId,
            milestoneId: milestoneId,
            projectId: projectId,
            disputeDescription: disputeDescription,
            freelancerUsername: freelancerUsername,
            projectTitle: projectTitle,
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-fit cursor-pointer">
                    Raise Dispute
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you really want to raise a dispute?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Raising a dispute will lock the project. The admins will be
                        notified and the dispute will be then dealt accordingly.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="description"
                            className="font-medium text-gray-700"
                        >
                            Dispute Description
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            placeholder="Describe your milestone..."
                            value={disputeDescription}
                            onChange={(e) => setDisputeDescription(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 outline-none resize-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            disabled={isPending || !disputeDescription.trim()}
                            variant="destructive"
                            type="submit"
                            className="cursor-pointer"
                        >
                            {isPending && <Spinner />} Confirm
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FreelancerRaiseDisputeDialog;
