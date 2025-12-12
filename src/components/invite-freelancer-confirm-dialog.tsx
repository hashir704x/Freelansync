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
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { createInvitation } from "@/api-functions/invitation-functions";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const InviteFreelancerConfirmDialog = (props: {
    clientId: string;
    freelancerId: string;
}) => {
    const { projectId } = useParams();
    const { isPending, mutate } = useMutation({
        mutationFn: createInvitation,
        onError(error) {
            if (error.message.includes("unique_project_invitation"))
                toast.error("Failed to send invitation. Freelancer is already invited");
            else toast.error(`Failed to send invitation. ${error.message}`);
        },
        onSuccess() {
            toast.success("Invitation send successfully!");
        },
    });
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="custom" disabled={isPending} className="mt-3">
                    {" "}
                    {isPending && <Spinner />}
                    Invite Freelancer
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to invite this freelancer to add into your
                        project?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            mutate({
                                clientId: props.clientId,
                                freelancerId: props.freelancerId,
                                projectId: projectId as string,
                            })
                        }
                        className="bg-(--my-blue) hover:bg-(--my-blue-light) cursor-pointer"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default InviteFreelancerConfirmDialog;
