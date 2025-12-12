import { getProjectDetailsById } from "@/api-functions/project-functions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

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
                    <div className="mb-6 border-b border-gray-200 pb-6">
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3 md:mb-0 tracking-tight">
                                {data.title}
                            </h1>

                            <div className="flex border-2 text-xs sm:text-sm p-2 rounded-md mb-4 md:mb-0 gap-2 mt-3">
                                <button
                                    onClick={() => setActiveOption("info")}
                                    className={`${
                                        activeOption === "info" &&
                                        "bg-(--my-blue) text-white"
                                    } h-10 rounded-md cursor-pointer w-full transition-all duration-200 px-2`}
                                >
                                    Info
                                </button>
                                <button
                                    onClick={() => setActiveOption("freelancers")}
                                    className={`${
                                        activeOption === "freelancers" &&
                                        "bg-(--my-blue) text-white"
                                    } w-full h-10 rounded-md cursor-pointer transition-all duration-200 px-2`}
                                >
                                    Freelancers
                                </button>
                                <button
                                    onClick={() => setActiveOption("add_freelancer")}
                                    className={`${
                                        activeOption === "add_freelancer" &&
                                        "bg-(--my-blue) text-white"
                                    } w-full h-10 rounded-md cursor-pointer transition-all duration-200 px-2`}
                                >
                                    Add Freelancers
                                </button>
                                <button
                                    onClick={() => setActiveOption("milestones")}
                                    className={`${
                                        activeOption === "milestones" &&
                                        "bg-(--my-blue) text-white"
                                    }  h-10 rounded-md cursor-pointer w-full transition-all duration-200 px-2`}
                                >
                                    Milestones
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-gray-600 mt-6">
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
                        <div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Project Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {data.description}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Project Domains
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {data.domains.map((item) => (
                                        <span
                                            key={item}
                                            className="px-4 py-1.5 text-sm bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-all"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Required Skills
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {data.skills.map((item) => (
                                        <span
                                            key={item}
                                            className="px-4 py-1.5 text-sm bg-blue-50 text-blue-700 font-medium rounded-full border border-blue-100 hover:bg-blue-100 transition-all"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Project Client
                                </h2>
                                <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center w-[300px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                                    <img
                                        src={data.clients.profile_pic}
                                        alt="profile-pic"
                                        className="w-24 h-24 rounded-full object-cover border-4 border-(--my-blue) shadow-sm"
                                    />

                                    <h3 className="text-xl font-semibold text-gray-800 mt-4">
                                        {data.clients.username}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">Client</p>

                                    <div className="w-full h-px bg-gray-100 my-4" />

                                    {user.role === "client" &&
                                    user.id === data.clients.id ? (
                                        <Link to={`/client/client-profile-own`}>
                                            <Button variant="custom">
                                                View my profile
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link to={"#"}>
                                            <Button variant="custom">View Profile</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetialsClientPage;
