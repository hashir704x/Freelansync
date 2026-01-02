import { getAllFreelancers } from "@/api-functions/freelancer-functions";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import FreelancerCard from "@/components/freelancer-card";
import { userStore } from "@/stores/user-store";
import type { FreelancerFromBackendType, UserType } from "@/Types";
import { Search } from "lucide-react";
import { useState } from "react";

const AllFreelancersClientPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryFn: getAllFreelancers,
        queryKey: ["get-all-freelancers"],
    });

    const [search, setSearch] = useState("");

    const user = userStore((state) => state.user) as UserType;

    let filteredFreelancers: FreelancerFromBackendType[] = data || [];

    const s = search.trim().toLocaleLowerCase();
    if (data && s !== "") {
        filteredFreelancers = data.filter(
            (freelancer) =>
                freelancer.username.toLowerCase().includes(s) ||
                freelancer.email.toLowerCase().includes(s) ||
                freelancer.domains.some((domain) => domain.toLowerCase().includes(s)) ||
                freelancer.skills.some((skill) => skill.toLowerCase().includes(s))
        );
    }

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
                <div className="p-6">
                    <h2 className="text-sm sm:text-base">
                        Search freelancers using their name, email, domains and skills
                    </h2>
                    <div className="border sm:w-full mt-2 flex h-10 sm:h-12 px-4 gap-4 items-center rounded-md">
                        <Search className="text-(--my-blue)" />
                        <input
                            className="h-full w-full outline-0 text-sm sm:text-base"
                            placeholder="Search for freelancers"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-5 mt-4  justify-center  sm:justify-start">
                        {filteredFreelancers.map((freelancer) => (
                            <FreelancerCard
                                key={freelancer.id}
                                showInviteButton={false}
                                user={user}
                                data={freelancer}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllFreelancersClientPage;
