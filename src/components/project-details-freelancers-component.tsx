import type { ProjectDetailsByIdFromBackendType, UserType } from "@/Types";
import FreelancerCard from "./freelancer-card";
import { User } from "lucide-react";

type PropsType = {
    user: UserType;
    data: ProjectDetailsByIdFromBackendType;
};

const ProjectDetailsFreelancersComponent = ({ data, user }: PropsType) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Member Freelancers
            </h2>

            <div className="flex items-center gap-5">
                {data.project_and_freelancer_link.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full mt-24">
                        <div className="p-2 border bg-gray-200 rounded-lg">
                            <User size={28} fill="true" />
                        </div>
                        <h2 className="text-xl font-medium mt-2">No Freelancers Yet</h2>
                        <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                            This project has no freelancers yet.
                        </p>
                    </div>
                )}

                {data.project_and_freelancer_link.length >= 1 && (
                    <div className="mt-8 flex gap-8 flex-wrap">
                        {data.project_and_freelancer_link.map((item) => (
                            <FreelancerCard
                                key={item.freelancer.id}
                                showInviteButton={false}
                                user={user}
                                data={item.freelancer}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailsFreelancersComponent;
