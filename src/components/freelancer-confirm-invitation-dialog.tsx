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
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    acceptInviteAndAddFreelancerToProject,
    deleteInvitation,
} from "@/api-functions/invitation-functions";
import { toast } from "sonner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";

type PropsType = {
    action: "accept" | "reject";
    projectId: string;
    clientId: string;
    invitationId: string;
    projectTitle: string;
};

const FreelancerConfirmInvitationDialog = (props: PropsType) => {
    const user = userStore((state) => state.user) as UserType;
    const queryClient = useQueryClient();

    const { mutate: acceptMutation, isPending: acceptPending } = useMutation({
        mutationFn: acceptInviteAndAddFreelancerToProject,
        onSuccess() {
            toast.success("You have been added to project successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-invitattions-for-freelancer"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-projects-for-freelancer"],
            });
        },
        onError(error) {
            toast.error(`Something went wrong: ${error.message}`);
        },
    });

    const { mutate: rejectMutation, isPending: rejectionPending } = useMutation({
        mutationFn: deleteInvitation,
        onSuccess() {
            toast.success("Invitation rejected successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-invitattions-for-freelancer"],
            });
        },
        onError(error) {
            toast.error(`Something went wrong: ${error.message}`);
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {props.action === "accept" ? (
                    <Button
                        variant="custom"
                        disabled={acceptPending || rejectionPending}
                        className="mt-3"
                    >
                        {" "}
                        {acceptPending && <Spinner />}
                        Accept
                    </Button>
                ) : (
                    <Button
                        variant="destructive"
                        disabled={rejectionPending || acceptPending}
                        className="mt-3 cursor-pointer"
                    >
                        {" "}
                        {rejectionPending && <Spinner />}
                        Reject
                    </Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to{" "}
                        {props.action === "accept" ? "accept" : "reject"} the invitation?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => {
                            if (props.action === "accept")
                                acceptMutation({
                                    clientId: props.clientId,
                                    freelancerId: user.id,
                                    invitationId: props.invitationId,
                                    projectId: props.projectId,
                                    freelancerUsername: user.username,
                                    projectTitle: props.projectTitle,
                                });
                            else rejectMutation(props.invitationId);
                        }}
                        className={`${
                            props.action === "accept"
                                ? "bg-(--my-blue) hover:bg-(--my-blue-light) cursor-pointer"
                                : "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                        } cursor-pointer`}
                    >
                        {props.action === "accept" ? "Accept" : "Reject"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FreelancerConfirmInvitationDialog;
