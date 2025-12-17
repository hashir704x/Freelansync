import { getFreelancerDetails } from "@/api-functions/freelancer-functions";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import InviteFreelancerIntoProjectSidebar from "@/components/invite-freelancer-into-project-sidebar";

const FreelancerOpenViewPage = () => {
    const user = userStore((state) => state.user) as UserType;

    const { freelancerId } = useParams();
    const { data, isError, isLoading } = useQuery({
        queryFn: () => getFreelancerDetails(freelancerId as string),
        queryKey: ["get-freelancer-details", freelancerId],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Freelancer Profile
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Freelancer details data</p>
                </div>
            )}

            {data && (
                <div>
                    <div className="p-7 md:p-10 flex flex-col items-center gap-10">
                        {/* Upper Section — Profile Picture */}

                        <img
                            src={data.profile_pic}
                            alt="profile-img"
                            className="w-48 h-48 rounded-full object-cover border border-gray-200"
                        />

                        {/* Bottom Section — Freelancer Info */}
                        <div className="w-full space-y-6 text-gray-700">
                            <div className="flex justify-between border-b pb-2">
                                <h2 className="text-xl sm:text-2xl font-semibold text-(--my-blue)">
                                    Freelancer Profile
                                </h2>
                                {user.role === "client" && (
                                    <InviteFreelancerIntoProjectSidebar
                                        userId={user.id}
                                        freelancerId={freelancerId as string}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="text-lg font-semibold">
                                        {data.username}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-lg font-semibold break-all">
                                        {data.email}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-lg font-semibold">{data.role}</p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Account Created On
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {new Date(data.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-sm text-gray-500 mb-3">Domains</p>

                                    <div className="flex flex-wrap gap-2">
                                        {data.domains.map(
                                            (domain: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-(--my-blue)/10 text-(--my-blue) font-medium rounded-full text-sm shadow-sm hover:bg-(--my-blue)/20 transition-colors"
                                                >
                                                    {domain}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-sm text-gray-500 mb-3">Skillset</p>

                                    <div className="flex flex-wrap gap-2">
                                        {data.skills.map(
                                            (skill: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-(--my-blue)/10 text-(--my-blue) font-medium rounded-full text-sm shadow-sm hover:bg-(--my-blue)/20 transition-colors"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FreelancerOpenViewPage;
