import { getAllProjectsForClient } from "@/api-functions/project-functions";
import ClientDashboardPieChart from "@/components/client-dashboard-pie-chart";
import ClientDashboardBarChart from "@/components/client-dashboard-bar-chart";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import ClientDashboardCards from "@/components/client-dashboard-cards";
import ProjectCard from "@/components/project-card";
import DashboardUserCard from "@/components/dashboard-user-card";
import DashboardMilestonesSection from "@/components/dashboard-milestones-section";

const ClientDashboard = () => {
    const user = userStore((state) => state.user) as UserType;
    const { data, isError, isLoading } = useQuery({
        queryFn: () => getAllProjectsForClient(user.id),
        queryKey: ["get-all-projects-for-client"],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Dashboard
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Dashboard Data</p>
                </div>
            )}
            {data && (
                <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-8">
                    <div className="flex gap-4 flex-col justify-center lg:justify-start lg:flex-row">
                        <ClientDashboardPieChart projectsData={data} />
                        <ClientDashboardBarChart projectsData={data} />
                        <DashboardUserCard user={user} />
                    </div>

                    <ClientDashboardCards projectsData={data} />
                    <div>
                        <h2 className="font-medium text-2xl">Latest Projects</h2>
                        {data.length === 0 && <div>You have no projects</div>}
                        <div className="flex mt-4 gap-6 flex-wrap justify-center md:justify-start">
                            {data.slice(0, 3).map((item) => (
                                <ProjectCard key={item.id} projectData={item} />
                            ))}
                        </div>
                    </div>

                    <DashboardMilestonesSection userData={user} />
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
