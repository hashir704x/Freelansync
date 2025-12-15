import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFreelancersToRecommend } from "@/api-functions/freelancer-functions";
import { Spinner } from "./ui/spinner";
import FreelancerCard from "./freelancer-card";
import type { FreelancerFromBackendType, UserType } from "@/Types";
import InvitedFreelancersSidebar from "./invited-freelancers-sidebar";

const ProjectDetailsAddFreelancersComponent = ({
    user,
    projectId,
}: {
    user: UserType;
    projectId: string;
}) => {
    const { data, isError, isLoading } = useQuery({
        queryFn: () => getFreelancersToRecommend(projectId),
        queryKey: ["get-recommended-freelancers", projectId],
    });
    const [findBy, setFindBy] = useState<"ai_matchmaking" | "manually">("manually");
    const [search, setSearch] = useState("");

    let filteredFreelancers: FreelancerFromBackendType[] = data || [];
    const s = search.trim().toLocaleLowerCase();
    if (data && s !== "") {
        filteredFreelancers = data.filter(
            (freelancer) =>
                freelancer.username.toLowerCase().includes(s) ||
                freelancer.email.toLowerCase().includes(s) ||
                freelancer.domains.some((domain) => domain.toLowerCase().includes(s)) ||
                freelancer.skills.some((skill) => skill.toLowerCase().includes(s))
        );
    }
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div className="flex gap-2 border-2 border-(--my-blue) rounded-md w-fit text-xs sm:text-sm">
                    <button
                        onClick={() => setFindBy("manually")}
                        className={`${
                            findBy === "manually" && "bg-(--my-blue) text-white"
                        } h-10 rounded cursor-pointer w-[150px] sm:w-[200px] transition-all duration-200 px-2`}
                    >
                        Find Manually
                    </button>
                    <button
                        onClick={() => setFindBy("ai_matchmaking")}
                        className={`${
                            findBy === "ai_matchmaking" && "bg-(--my-blue) text-white"
                        } w-[150px] sm:w-[200px] h-10 rounded cursor-pointer transition-all duration-200 px-2`}
                    >
                        Use Ai Matchmaking
                    </button>
                </div>

                <InvitedFreelancersSidebar />
            </div>

            <div className="mt-4">
                {findBy === "manually" && (
                    <div>
                        <h2 className="text-sm sm:text-base">
                            Find freelancers using their name, email, domains and skills
                        </h2>
                        <div className="border sm:w-full mt-2 flex h-10 sm:h-12 px-4 gap-4 items-center rounded-md">
                            <Search className="text-(--my-blue)" />
                            <input
                                className="h-full w-full outline-0 text-sm sm:text-base"
                                placeholder="Search for freelancers"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {isLoading && (
                            <div className=" flex flex-col gap-3 justify-center items-center w-full">
                                <Spinner className="size-8 text-(--my-blue) mt-20" />
                                <p className="text-gray-600">Fetcing freelancers</p>
                            </div>
                        )}

                        {isError && (
                            <div className="text-center mt-24 text-red-600">
                                Something went wrong, failed to get freelancer!
                            </div>
                        )}

                        {data && (
                            <div className="mt-8 flex gap-8 flex-wrap">
                                {filteredFreelancers.map((item) => (
                                    <FreelancerCard
                                        key={item.id}
                                        data={item}
                                        showInviteButton={true}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailsAddFreelancersComponent;
