import { getClientDetailsForFreelancer } from "@/api-functions/client-function";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ClientDetailsFreelancerPage = () => {
    const { clientId } = useParams();
    const { data, isError, isLoading } = useQuery({
        queryFn: () => getClientDetailsForFreelancer(clientId as string),
        queryKey: ["get-client-details-for-freelancer", clientId],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Client Profile
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Client details data</p>
                </div>
            )}

            {data && (
                <div>
                    <div className="p-7 md:p-10 flex flex-col items-center gap-10">
                        <img
                            src={data.profile_pic}
                            alt="profile-img"
                            className="w-48 h-48 rounded-full object-cover border border-gray-200"
                        />

                        {/* Bottom Section — Freelancer Info */}
                        <div className="w-full space-y-6 text-gray-700">
                            <h2 className="text-2xl font-semibold text-(--my-blue) border-b pb-2">
                                Client Profile
                            </h2>

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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetailsFreelancerPage;
