import { getProjectDetailsById } from "@/api-functions/project-functions";
import ProjectDetailsAddFreelancersComponent from "@/components/project-details-add-freelancers-component";
import ProjectDetailsFreelancersComponent from "@/components/project-details-freelancers-component";
import ProjectDetailsInfoComponent from "@/components/project-details-info-components";
import ProjectDetialsMilestonesComponent from "@/components/project-details-milestones-component";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetialsClientPage = () => {
    const { projectId } = useParams();

    const user = userStore((state) => state.user) as UserType;
    const [activeOption, setActiveOption] = useState<
        "info" | "freelancers" | "milestones" | "add_freelancer"
    >("info");

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getProjectDetailsById(projectId as string),
        queryKey: ["get-project-details", projectId],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Projects Details
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Project detailed data </p>
                </div>
            )}

            {data && (
                <div className="max-w-6xl mx-auto px-4 xl:py-10 py-4">
                    <div className="mb-5 border-b border-gray-200 pb-4">
                        <div className="flex flex-col">
                            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 md:mb-2 tracking-tight">
                                {data.title}
                            </h1>

                            <div className="flex border-2 border-(--my-blue) text-xs sm:text-sm  rounded-md mb-2 md:mb-0 gap-2 mt-3">
                                <button
                                    onClick={() => setActiveOption("info")}
                                    className={`${
                                        activeOption === "info" &&
                                        "bg-(--my-blue) text-white"
                                    } h-10 rounded cursor-pointer w-full transition-all duration-200 px-2`}
                                >
                                    Info
                                </button>
                                <button
                                    onClick={() => setActiveOption("freelancers")}
                                    className={`${
                                        activeOption === "freelancers" &&
                                        "bg-(--my-blue) text-white"
                                    } w-full h-10 rounded cursor-pointer transition-all duration-200 px-2`}
                                >
                                    Freelancers
                                </button>
                                <button
                                    onClick={() => setActiveOption("add_freelancer")}
                                    className={`${
                                        activeOption === "add_freelancer" &&
                                        "bg-(--my-blue) text-white"
                                    } w-full h-10 rounded cursor-pointer transition-all duration-200 px-2`}
                                >
                                    Add Freelancers
                                </button>
                                <button
                                    onClick={() => setActiveOption("milestones")}
                                    className={`${
                                        activeOption === "milestones" &&
                                        "bg-(--my-blue) text-white"
                                    }  h-10 rounded cursor-pointer w-full transition-all duration-200 px-2`}
                                >
                                    Milestones
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-6 text-sm sm:text-base">
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">📅</span>
                                {new Date(data.created_at).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">💰</span>
                                <span className="font-semibold text-gray-800">
                                    Rs {data.budget.toLocaleString()}
                                </span>
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">🧠</span>
                                {data.skills.length} skills required
                            </span>
                        </div>
                    </div>

                    {activeOption === "info" && (
                        <ProjectDetailsInfoComponent user={user} data={data} />
                    )}

                    {activeOption === "freelancers" && (
                        <ProjectDetailsFreelancersComponent data={data} user={user} />
                    )}

                    {activeOption === "add_freelancer" && (
                        <ProjectDetailsAddFreelancersComponent
                            user={user}
                            projectId={projectId as string}
                        />
                    )}

                    {activeOption === "milestones" && (
                        <ProjectDetialsMilestonesComponent />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetialsClientPage;
