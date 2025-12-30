import { userStore } from "@/stores/user-store";
import type { ProjectFromBackendType, UserType } from "@/Types";
import { Link } from "react-router-dom";

const ProjectCard = ({ projectData }: { projectData: ProjectFromBackendType }) => {
    const user = userStore((state) => state.user) as UserType;
    return (
        <div className="border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 w-[340px] flex flex-col justify-between hover:-translate-y-1">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
                {projectData.title}
            </h2>

            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {projectData.description}
            </p>

            {/* Budget & Status */}
            <div className="flex justify-between items-center mt-3">
                <span className="text-gray-700 font-medium">
                    💰 Rs {projectData.original_budget.toLocaleString()}
                </span>
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        projectData.status === "DRAFT"
                            ? "bg-chart-3/40 text-yellow-700"
                            : projectData.status === "ACTIVE"
                            ? "bg-chart-1/20 text-blue-700"
                            : projectData.status === "COMPLETED"
                            ? "bg-chart-2/30 text-green-700"
                            : "bg-chart-4/30 text-red-700"
                    }`}
                >
                    {projectData.status.replace("_", " ")}
                </span>
            </div>

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

            <p className="text-gray-400 text-xs mt-3">
                Created: {new Date(projectData.created_at).toLocaleDateString()}
            </p>

            <Link
                to={`/${
                    user.role === "client" ? "client" : "freelancer"
                }/project-details/${projectData.id}`}
            >
                <button className="cursor-pointer hover:bg-(--my-blue-light) mt-3 bg-(--my-blue) py-2 px-3 text-white text-xs rounded-full w-full transition-all duration-300">
                    Open
                </button>
            </Link>
        </div>
    );
};

export default ProjectCard;
