import type { ProjectDetailsByIdFromBackendType, UserType } from "@/Types";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

type Props = {
    user: UserType;
    data: ProjectDetailsByIdFromBackendType;
};

const ProjectDetailsInfoComponent = ({ data, user }: Props) => {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Project Description
                </h2>
                <p className="text-gray-700 leading-relaxed">{data.description}</p>
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
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center w-[300px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <img
                        src={data.client.profile_pic}
                        alt="profile-pic"
                        className="w-24 h-24 rounded-full object-cover border-4 border-(--my-blue) shadow-sm"
                    />

                    <h3 className="text-xl font-semibold text-gray-800 mt-4">
                        {data.client.username}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">Client</p>

                    <div className="w-full h-px bg-gray-100 my-4" />

                    {user.role === "client" && user.id === data.client.id ? (
                        <Link to={`/client/client-profile-own`}>
                            <Button variant="custom">View my profile</Button>
                        </Link>
                    ) : (
                        <Link to={`/freelancer/client-details/${data.client.id}`}>
                            <Button variant="custom">View Profile</Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsInfoComponent;
