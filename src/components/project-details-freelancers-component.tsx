import type { ProjectDetailsByIdFromBackendType, UserType } from "@/Types";
import FreelancerCard from "./freelancer-card";

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
                    <div>No freelancer added yet</div>
                )}

                {data.project_and_freelancer_link.length >= 1 &&
                    data.project_and_freelancer_link.map((item) => (
                        <FreelancerCard
                            key={item.freelancer.id}
                            showInviteButton={false}
                            user={user}
                           data={item.freelancer}
                        />
                    ))}
            </div>
        </div>
    );
};

export default ProjectDetailsFreelancersComponent;
