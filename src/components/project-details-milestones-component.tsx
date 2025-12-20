import type { FreelancerFromBackendType, UserType } from "@/Types";
import CreateMilestoneDialog from "./create-milestone-dialog";
import { useQuery } from "@tanstack/react-query";
import { getAllMilestonesForProject } from "@/api-functions/milestone-functions";
import { Spinner } from "./ui/spinner";
import { Flag } from "lucide-react";
import MilestoneCard from "./milestone-card";

type PropsType = {
    freelancersData?: {
        freelancer: FreelancerFromBackendType;
    }[];
    user: UserType;
    projectId: string;
    projectTitle: string;
};

const ProjectDetialsMilestonesComponent = (props: PropsType) => {
    const { isLoading, isError, data } = useQuery({
        queryFn: () => getAllMilestonesForProject(props.projectId),
        queryKey: ["get-all-milestones-for-project", props.projectId],
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Project Milestones
                </h2>
                {props.freelancersData && props.user.role === "client" && (
                    <CreateMilestoneDialog
                        clientUsername={props.user.username}
                        clientId={props.user.id}
                        freelancersData={props.freelancersData}
                        projectId={props.projectId}
                        projectTitle={props.projectTitle}
                    />
                )}
            </div>

            {isLoading && (
                <div className="flex flex-col gap-3 justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue) mt-24" />
                    <p className="text-gray-600">Fetcing Milestones</p>
                </div>
            )}

            {isError && (
                <div className="text-center mt-24 text-red-600">
                    Something went wrong, failed to get milestones!
                </div>
            )}

            {data && data.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full mt-24">
                    <div className="p-2 border bg-gray-200 rounded-lg">
                        <Flag size={28} fill="true" />
                    </div>
                    <h2 className="text-xl font-medium mt-2">No Milestones Yet</h2>
                    <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                        This project has no milestones yet.
                    </p>
                </div>
            )}
            {data && data.length >= 1 && (
                <div className="mt-5 flex gap-8 flex-wrap">
                    {data.map((item) => (
                        <MilestoneCard key={item.id} milestoneData={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectDetialsMilestonesComponent;
