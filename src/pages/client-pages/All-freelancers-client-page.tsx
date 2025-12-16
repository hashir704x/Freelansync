import { getAllFreelancers } from "@/api-functions/freelancer-functions";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import FreelancerCard from "@/components/freelancer-card";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";

const AllFreelancersClientPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllFreelancers,
        queryKey: ["get-all-freelancers"],
    });

    const user = userStore((state) => state.user) as UserType;
    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                All Freelancers
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Client data</p>
                </div>
            )}

            {data && (
                <div className="flex flex-wrap gap-5 p-6 justify-center  sm:justify-start">
                    {data.map((freelancer) => (
                        <FreelancerCard
                            key={freelancer.id}
                            showInviteButton={false}
                            user={user}
                            data={freelancer}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllFreelancersClientPage;
