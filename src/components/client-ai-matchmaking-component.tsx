import { getAiMatchMakingFreelancersResults } from "@/api-functions/freelancer-functions";
import { useQuery } from "@tanstack/react-query";
import FreelancerCard from "./freelancer-card";
import { Spinner } from "./ui/spinner";
import type { UserType } from "@/Types";

type PropsType = {
    projectSkills: string[];
    projectId: string;
    user: UserType;
    activeState: "info" | "freelancers" | "milestones" | "add_freelancer";
};

const count = 3;

const ClientAiMatchmakingComponent = (props: PropsType) => {
    const { data, isLoading, isError } = useQuery({
        queryFn: () =>
            getAiMatchMakingFreelancersResults({
                skills: props.projectSkills,
                count: count,
            }),
        queryKey: ["get-ai-recommendations-for-project", props.projectId],
    });

    return (
        <div>
            {isLoading && (
                <div className="flex justify-center flex-col items-center w-full mt-28">
                    <Spinner className="size-8 text-(--my-blue)" />
                    <p className="text-(--my-blue) mt-4">Ai Matchmaking...</p>
                </div>
            )}

            {isError && (
                <div className="mt-20 flex justify-center items-center w-full">
                    <p>Error in getting AI Recommendations!</p>
                </div>
            )}

            {data && (
                <div className="mt-16 flex gap-8 flex-wrap">
                    {data.map((item) => (
                        <FreelancerCard
                            user={props.user}
                            showInviteButton={true}
                            activeState={props.activeState}
                            data={item}
                            key={item.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientAiMatchmakingComponent;
