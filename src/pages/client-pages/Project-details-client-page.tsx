import { getProjectDetailsById } from "@/api-functions/project-functions";
import ProjectDetailsAddFreelancersComponent from "@/components/project-details-add-freelancers-component";
import ProjectDetailsFreelancersComponent from "@/components/project-details-freelancers-component";
import ProjectDetailsInfoComponent from "@/components/project-details-info-components";
import ProjectDetialsMilestonesComponent from "@/components/project-details-milestones-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ClientProjectCompletionDialog from "@/components/client-project-completion-dialog";
import ClientEditProjectDialog from "@/components/client-edit-project-dialog";
import ClientProjectAddFundsDialog from "@/components/client-project-add-funds-dialog";

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

    const [openCompleteProjectDialog, setOpenCompleteProjectDialog] = useState(false);

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

                                {data.status !== "COMPLETED" &&
                                    data.status !== "DISPUTED" && (
                                        <button
                                            onClick={() =>
                                                setActiveOption("add_freelancer")
                                            }
                                            className={`${
                                                activeOption === "add_freelancer" &&
                                                "bg-(--my-blue) text-white"
                                            } w-full h-10 rounded cursor-pointer transition-all duration-200 px-2`}
                                        >
                                            Add Freelancers
                                        </button>
                                    )}
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

                            <span
                                className={`text-sm font-semibold px-3 py-2 rounded-full ${
                                    data.status === "DRAFT"
                                        ? "bg-chart-3/40 text-yellow-700"
                                        : data.status === "ACTIVE"
                                        ? "bg-chart-1/20 text-blue-700"
                                        : data.status === "COMPLETED"
                                        ? "bg-chart-2/30 text-green-700"
                                        : "bg-chart-4/30 text-red-700"
                                }`}
                            >
                                {data.status.replace("_", " ")}
                            </span>

                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">🧠</span>
                                {data.skills.length} skills required
                            </span>

                            <Link
                                to={`/${
                                    user.role === "client" ? "client" : "freelancer"
                                }/project-chat/${projectId}`}
                            >
                                <Button variant="custom">
                                    <MessageCircleMore /> Open Chat
                                </Button>
                            </Link>

                            {data.status !== "COMPLETED" &&
                                data.status !== "DISPUTED" && (
                                    <ClientProjectCompletionDialog
                                        openCompleteProjectDialog={
                                            openCompleteProjectDialog
                                        }
                                        setOpenCompleteProjectDialog={
                                            setOpenCompleteProjectDialog
                                        }
                                        projectId={projectId as string}
                                    />
                                )}

                            <div>
                                <ClientEditProjectDialog projectData={data} />
                            </div>

                            <div>
                                <ClientProjectAddFundsDialog
                                    userId={user.id}
                                    projectId={projectId as string}
                                    projectCurrentBudget={data.budget}
                                    projectOriginalBudget={data.original_budget}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-2xl border py-4 px-6 shadow-sm mt-4">
                            {/* Header */}
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Project Budget
                                </p>
                            </div>

                            {/* Numbers */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Original */}
                                <div>
                                    <p className="text-sm text-gray-500">Original</p>
                                    <p className="mt-1 sm:text-xl font-medium text-gray-900">
                                        Rs {data.original_budget.toLocaleString()}
                                    </p>
                                </div>

                                {/* Available */}
                                <div className="border-l pl-6">
                                    <p className="text-sm text-gray-500">Available</p>
                                    <p className="mt-1 sm:text-xl font-semibold text-(--my-blue)">
                                        Rs {data.budget.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Context */}
                            <p className="text-xs text-gray-400">
                                Available funds decrease automatically as milestones are
                                added.
                            </p>
                        </div>

                        {data.status === "COMPLETED" && (
                            <p className="mt-4 text-gray-700 font-medium">
                                You cannot add freelancers or create new milestones in a
                                completed project
                            </p>
                        )}

                        {data.status === "DISPUTED" && (
                            <p className="mt-4 text-gray-700 font-medium">
                                You cannot add freelancers or create new milestones in a
                                disputed project
                            </p>
                        )}
                    </div>

                    {activeOption === "info" && (
                        <ProjectDetailsInfoComponent user={user} data={data} />
                    )}

                    {activeOption === "freelancers" && (
                        <ProjectDetailsFreelancersComponent
                            data={data}
                            user={user}
                            activeState={activeOption}
                            projectId={projectId as string}
                            projectTitle={data.title as string}
                        />
                    )}

                    {activeOption === "add_freelancer" && (
                        <ProjectDetailsAddFreelancersComponent
                            user={user}
                            projectId={projectId as string}
                            activeState={activeOption}
                            projectSkills={data.skills}
                        />
                    )}

                    {activeOption === "milestones" && (
                        <ProjectDetialsMilestonesComponent
                            freelancersData={data.project_and_freelancer_link}
                            user={user}
                            projectId={projectId as string}
                            projectTitle={data.title}
                            projectBudget={data.budget}
                            projectStatus={data.status}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetialsClientPage;
