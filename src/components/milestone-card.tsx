import type { MilestonesFromBackendType } from "@/Types";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type PropsType = {
    milestoneData: MilestonesFromBackendType;
    userRole: "client" | "freelancer";
};

const MilestoneCard = ({ milestoneData, userRole }: PropsType) => {
    return (
        <div className="group relative w-[340px] rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
            {/* STATUS BADGE */}
            <span
                className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                    milestoneData.status === "LOCKED"
                        ? "bg-yellow-100 text-yellow-700"
                        : milestoneData.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-700"
                        : milestoneData.status === "SUBMITTED"
                        ? "bg-green-100 text-green-700"
                        : milestoneData.status === "DISPUTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                }`}
            >
                {milestoneData.status.replace("_", " ")}
            </span>

            {/* TITLE */}
            <h2 className=" max-w-[85%] truncate text-base font-semibold text-gray-900">
                {milestoneData.title.length > 20
                    ? `${milestoneData.title.slice(0, 20)}...`
                    : `${milestoneData.title}`}
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {milestoneData.description || "No description provided."}
            </p>

            {/* AMOUNT */}
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-800">
                <span className="text-lg">💰</span>
                <span>Rs {milestoneData.amount.toLocaleString()}</span>
            </div>

            {/* DIVIDER */}
            <div className="my-4 h-px w-full bg-gray-100" />

            {/* ASSIGNED FREELANCER */}
            <div className="flex items-center gap-3">
                <img
                    src={milestoneData.freelancer.profile_pic}
                    alt="profile"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Assigned to</span>
                    <span className="text-sm font-medium text-gray-800">
                        {milestoneData.freelancer.username}
                    </span>
                </div>
            </div>

            {/* FOOTER */}
            <p className="mt-4 text-[11px] text-gray-400">
                Created on {new Date(milestoneData.created_at).toLocaleDateString()}
            </p>
            <Link
                to={`${
                    userRole === "client" ? "/client" : "/freelancer"
                }/milestone-details/${milestoneData.id}`}
            >
                <Button variant="custom" className="mt-2 w-full">
                    Open
                </Button>
            </Link>
        </div>
    );
};

export default MilestoneCard;
