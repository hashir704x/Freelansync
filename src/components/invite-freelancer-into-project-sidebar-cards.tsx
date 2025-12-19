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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvitation } from "@/api-functions/invitation-functions";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

type PropsType = {
    projectData: { id: string; title: string; domains: string[]; budget: number };
    clientId: string;
    clientUsername: string;
};

const SendInviteConfirmDialog = (props: {
    projectId: string;
    clientId: string;
    clientUsername: string;
}) => {
    const { freelancerId } = useParams();
    const queryClient = useQueryClient();
    const { isPending, mutate } = useMutation({
        mutationFn: createInvitation,
        onError(error) {
            if (error.message.includes("unique_project_invitation"))
                toast.error("Failed to send invitation. Freelancer is already invited");
            else toast.error(`Failed to send invitation. ${error.message}`);
        },
        onSuccess() {
            toast.success("Invitation send successfully!");
            queryClient.invalidateQueries({
                queryKey: ["get-invited-freelancers-for-project", props.projectId],
            });
        },
    });
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    disabled={isPending}
                    className="mt-3 text-(--my-blue) hover:bg-(--my-blue) hover:text-white"
                >
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
                                freelancerId: freelancerId as string,
                                projectId: props.projectId,
                                clientUsername: props.clientUsername,
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

const InviteFreelancerIntoProjectSidebarCard = ({
    projectData,
    clientId,
    clientUsername,
}: PropsType) => {
    return (
        <div className="border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300  flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
                {projectData.title}
            </h2>

            <span className="text-gray-700 font-medium mt-2">
                💰 Rs {projectData.budget.toLocaleString()}
            </span>

            <div className="flex flex-wrap gap-2 mt-3 items-center">
                {projectData.domains.slice(0, 3).map((domain) => (
                    <span
                        key={domain}
                        className="font-medium bg-blue-100 text-(--my-blue) text-xs px-2 py-1 rounded-full"
                    >
                        {domain}
                    </span>
                ))}
                {projectData.domains.length > 3 && (
                    <span className="text-gray-500 text-xs">
                        +{projectData.domains.length - 3}
                    </span>
                )}
            </div>

            <SendInviteConfirmDialog
                projectId={projectData.id}
                clientId={clientId}
                clientUsername={clientUsername}
            />
        </div>
    );
};

export default InviteFreelancerIntoProjectSidebarCard;
