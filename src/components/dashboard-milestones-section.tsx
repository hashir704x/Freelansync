import { getRecentMilestonesForUser } from "@/api-functions/milestone-functions";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import MilestoneCard from "./milestone-card";
import { Spinner } from "./ui/spinner";

const DashboardMilestonesSection = ({ userData }: { userData: UserType }) => {
    const { data, isLoading, isError } = useQuery({
        queryFn: () =>
            getRecentMilestonesForUser({ userId: userData.id, userRole: userData.role }),
        queryKey: ["get-recent-milestones-for-user"],
    });

    return (
        <div>
            <h2 className="font-medium text-2xl">Latest Milestones</h2>

            {isLoading && (
                <div className="mt-10 flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting recent milestones Data</p>
                </div>
            )}

            {data && data.length === 0 && (
                <div>
                    <div className="flex flex-col items-center justify-center w-full mt-10">
                        <h2 className="text-xl font-medium mt-2">No Milestones Yet</h2>
                        <p className="text-center mt-2 text-gray-500 font-medium">
                            Your projects have no milestones yet.
                        </p>
                    </div>
                </div>
            )}
            {data && data.length >= 1 && (
                <div className="mt-5 flex gap-8 flex-wrap">
                    {data.map((item) => (
                        <MilestoneCard
                            key={item.id}
                            milestoneData={item}
                            userRole={userData.role}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardMilestonesSection;
