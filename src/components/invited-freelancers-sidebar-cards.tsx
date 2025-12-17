import type { InvitationsForProjectFromBackendType } from "@/Types";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInvitation } from "@/api-functions/invitation-functions";
import { toast } from "sonner";

type PropsType = {
    invitationData: InvitationsForProjectFromBackendType;
};

const InvitedFreelancersSidebarCards = ({ invitationData }: PropsType) => {
    const queryClient = useQueryClient();
    const { isPending, mutate } = useMutation({
        mutationFn: deleteInvitation,
        onError(error) {
            toast.error(`Failed to cancel invitation: ${error.message}`);
        },
        onSuccess() {
            toast.success("Invitation canceled successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-invited-freelancers-for-project", invitationData.project],
            });
        },
    });

    const formattedDate = new Date(invitationData.created_at).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
    return (
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all mb-4">
            <img
                src={invitationData.freelancer.profile_pic}
                alt={invitationData.freelancer.username}
                className="w-[70px] h-[70px] rounded-full object-cover border border-gray-300"
            />

            <div className="flex flex-col flex-1">
                <h3 className="font-semibold text-(--my-blue)">
                    {invitationData.freelancer.username}
                </h3>
                <p className="text-xs text-gray-500">{invitationData.freelancer.email}</p>

                <div className="flex flex-wrap gap-1 mt-3 items-center">
                    {invitationData.freelancer.domains.slice(0, 2).map((domain, i) => (
                        <span
                            key={i}
                            className="text-xs bg-gray-100 text-(--my-blue) font-medium px-2 py-1 rounded-full border border-gray-200"
                        >
                            {domain}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">Invited on {formattedDate}</p>

                    <Button
                        disabled={isPending}
                        onClick={() => mutate(invitationData.id)}
                        variant="destructive"
                        size="sm"
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-700 hover:text-white hover:border-red-600 transition-all text-xs px-2 cursor-pointer"
                    >
                        {isPending && <Spinner />}
                        Cancel Invite
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InvitedFreelancersSidebarCards;
