import type { FreelancerFromBackendType, UserType } from "@/Types";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import InviteFreelancerConfirmDialog from "./invite-freelancer-confirm-dialog";

type PropsType = {
    data: FreelancerFromBackendType;
    showInviteButton: boolean;
    user: UserType;
};

const FreelancerCard = (props: PropsType) => {
    return (
        <div
            className={`bg-white rounded-2xl transition-all duration-200 border border-gray-200 p-4 flex flex-col w-[340px] justify-between shadow-[0_3px_10px_rgb(0,0,0,0.2)] ${
                props.showInviteButton ? "h-[450px]" : "h-[420px]"
            } `}
        >
            <div className="flex items-center gap-4">
                <img
                    src={props.data.profile_pic}
                    alt="profile-pic"
                    className="w-32 h-32 rounded-full object-cover border-2 border-(--my-blue)"
                />

                <div className="flex flex-col items-center font-semibold">
                    <h3 className="text-lg  text-gray-800">{props.data.username}</h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2">
                {props.data.description.length > 120
                    ? props.data.description.slice(0, 120) + "..."
                    : props.data.description}
            </p>

            {/* Domains */}
            <div className="w-full mt-3">
                <h3 className="text-sm text-gray-700 font-medium">Domains:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                    {props.data.domains.slice(0, 2).map((domain, i) => (
                        <span
                            key={i}
                            className="text-xs bg-gray-100 text-(--my-blue) font-medium px-2.5 py-1 rounded-full border border-gray-200"
                        >
                            {domain}
                        </span>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div className="w-full mt-3">
                <h3 className="text-sm text-gray-700 font-medium">Skills:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                    {props.data.skills.slice(0, 3).map((skill, i) => (
                        <span
                            key={i}
                            className="text-xs bg-gray-100 text-(--my-blue) font-medium px-2.5 py-1 rounded-full border border-gray-200"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {props.user.role === "freelancer" && props.user.id === props.data.id ? (
                <Link to="/freelancer/freelancer-profile">
                    <Button
                        variant="outline"
                        className="mt-3 w-full hover:bg-gray-100 cursor-pointer"
                    >
                        View my profile
                    </Button>
                </Link>
            ) : (
                <Link
                    to={`/${
                        props.user.role === "client" ? "client" : "freelancer"
                    }/freelancer-details/${props.data.id}`}
                >
                    <Button
                        variant="outline"
                        className="mt-3 w-full hover:bg-gray-100 cursor-pointer"
                    >
                        View Profile
                    </Button>
                </Link>
            )}

            {/* Action Button */}
            {props.showInviteButton && props.user.role === "client" && (
                <InviteFreelancerConfirmDialog
                    clientId={props.user.id}
                    freelancerId={props.data.id}
                />
            )}
        </div>
    );
};

export default FreelancerCard;
