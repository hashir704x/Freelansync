import { getAllProjectsForClient } from "@/api-functions/project-functions";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import { Link } from "react-router-dom";

const ClientAllProjectsPage = () => {
    const user = userStore((state) => state.user) as UserType;
    const { data, isError, isLoading } = useQuery({
        queryFn: () => getAllProjectsForClient(user.id),
        queryKey: ["get-all-projects-for-client"],
    });
    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                My Projects
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting All projects data</p>
                </div>
            )}
            {data && data.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)]">
                    <div className="p-2 border bg-gray-200 rounded-lg">
                        <Folder size={25} fill="true" />
                    </div>
                    <h2 className="text-xl font-medium mt-2">No Projects Yet</h2>
                    <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                        You haven't created any projects yet. Get started by creating your
                        first project.
                    </p>
                    <Link to="/client/create-project">
                        <Button variant="custom" className="mt-4">
                            Create Project
                        </Button>
                    </Link>
                </div>
            )}

            {data && data.length >= 1 && (
                <div className="flex p-6 gap-6 flex-wrap justify-center md:justify-start">
                    {data.map((item) => (
                        <ProjectCard key={item.id} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientAllProjectsPage;
