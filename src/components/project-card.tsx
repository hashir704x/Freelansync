import { userStore } from "@/stores/user-store";
import type { ProjectFromBackendType, UserType } from "@/Types";
import { Link } from "react-router-dom";

const ProjectCard = (props: ProjectFromBackendType) => {
    const user = userStore((state) => state.user) as UserType;
    return (
        <div className="border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 w-[340px] flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
                {props.title}
            </h2>

            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {props.description.length > 100
                    ? props.description.slice(0, 100) + "..."
                    : props.description}
            </p>

            {/* Budget & Status */}
            <div className="flex justify-between items-center mt-3">
                <span className="text-gray-700 font-medium">
                    💰 Rs {props.budget.toLocaleString()}
                </span>
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        props.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : props.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    {props.status.replace("_", " ")}
                </span>
            </div>

            {/* Required Skills */}
            <div className="flex flex-wrap gap-2 mt-3 items-center">
                {props.domains.slice(0, 3).map((domain) => (
                    <span
                        key={domain}
                        className="font-medium bg-blue-100 text-(--my-blue) text-xs px-2 py-1 rounded-full"
                    >
                        {domain}
                    </span>
                ))}
                {props.domains.length > 3 && (
                    <span className="text-gray-500 text-xs">
                        +{props.domains.length - 3}
                    </span>
                )}
            </div>

            {/* Created at */}
            <p className="text-gray-400 text-xs mt-3">
                Created: {new Date(props.created_at).toLocaleDateString()}
            </p>

            <Link
                to={`/${
                    user.role === "client" ? "client" : "freelancer"
                }/project-details/${props.id}`}
            >
                <button className="cursor-pointer hover:bg-(--my-blue-light) mt-3 bg-(--my-blue) py-2 px-3 text-white text-xs rounded-full w-full transition-all duration-300">
                    Open
                </button>
            </Link>
        </div>
    );
};

export default ProjectCard;
