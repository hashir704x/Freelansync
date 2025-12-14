import { getAllInvitationsForFreelancer } from "@/api-functions/invitation-functions";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { BadgeAlert } from "lucide-react";
import FreelancerInvitationCard from "@/components/freelancer-invitation-card";

const FreelancerInvitationsPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllInvitationsForFreelancer,
        queryKey: ["get-invitattions-for-freelancer"],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Invitations
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Invitations data!</p>
                </div>
            )}

            {data && data.length === 0 && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <div className="flex flex-col items-center justify-center text-center text-gray-500">
                        <div className="bg-(--my-blue)/10 text-(--my-blue) rounded-full p-4 mb-4">
                            <BadgeAlert size={40} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-700">
                            No Invitations Yet
                        </h3>
                        <p className="text-sm mt-1 text-gray-500 max-w-60">
                            You have not been invited to any project yet.
                        </p>
                    </div>
                </div>
            )}

            {data && data.length >= 1 && (
                <div className="py-6 px-4 flex flex-col items-center gap-5 border-2">
                    {data.map((item) => (
                        <FreelancerInvitationCard key={item.id} invitationData={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FreelancerInvitationsPage;
