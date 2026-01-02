import type { InvitationsForFreelancerFromBackendType } from "@/Types";
import { CalendarDays, User } from "lucide-react";
import { Link } from "react-router-dom";
import FreelancerConfirmInvitationDialog from "./freelancer-confirm-invitation-dialog";

const FreelancerInvitationCard = ({
    invitationData,
}: {
    invitationData: InvitationsForFreelancerFromBackendType;
}) => {
    return (
        <div className="border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center md:items-start gap-5 w-full max-w-3xl shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
            <div className="flex-1 text-center md:text-left space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 wrap-break-word">
                    {invitationData.project.title}
                </h2>
                <p className="text-gray-600 line-clamp-3 text-sm sm:text-base">
                    {invitationData.project.description}
                </p>

                <div>
                    <h3 className="font-medium text-gray-500 ml-1">Domains</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
                        {invitationData.project.domains.map((domain, index) => (
                            <span
                                key={index}
                                className="bg-blue-50 text-blue-600 text-xs sm:text-sm px-3 py-1 rounded-full font-medium border border-blue-100"
                            >
                                {domain}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-gray-500 ml-1">Skills</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
                        {invitationData.project.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-blue-50 text-blue-600 text-xs sm:text-sm px-3 py-1 rounded-full font-medium border border-blue-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-3 w-full md:w-auto">
                <img
                    src={invitationData.client.profile_pic}
                    alt={invitationData.client.username}
                    className="w-14 h-14 sm:w-24 sm:h-24 rounded-full object-cover mx-auto md:mx-0"
                />

                <div>
                    <Link
                        to={`/freelancer/client-details/${invitationData.client.id}`}
                        className="text-gray-800 font-medium flex items-center justify-center md:justify-end gap-2 text-sm sm:text-base hover:underline"
                    >
                        <User className="w-4 h-4 text-gray-500" />
                        {invitationData.client.username}
                    </Link>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-400 text-xs sm:text-sm">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(invitationData.created_at).toLocaleDateString()}
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-3 pt-2">
                    <FreelancerConfirmInvitationDialog
                        key={"2"}
                        action="accept"
                        clientId={invitationData.client.id}
                        projectId={invitationData.project.id}
                        invitationId={invitationData.id}
                        projectTitle={invitationData.project.title}
                    />
                    <FreelancerConfirmInvitationDialog
                        key={"1"}
                        action="reject"
                        clientId={invitationData.client.id}
                        projectId={invitationData.project.id}
                        invitationId={invitationData.id}
                        projectTitle={invitationData.project.title}
                    />
                </div>
            </div>
        </div>
    );
};

export default FreelancerInvitationCard;
