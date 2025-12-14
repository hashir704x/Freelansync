import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllInvitationsForProject } from "@/api-functions/invitation-functions";
import { Spinner } from "./ui/spinner";
import { BadgeAlert } from "lucide-react";
import InvitedFreelancersSidebarCards from "./invited-freelancers-sidebar-cards";

const InvitedFreelancersSidebar = () => {
    const { projectId } = useParams();

    const { data, isError, isLoading } = useQuery({
        queryFn: () => getAllInvitationsForProject(projectId as string),
        queryKey: ["get-invited-freelancers-for-project", projectId],
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="custom" className="w-[150px] mt-3 sm:mt-0 h-10">
                    View Invitations
                </Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Invited Freelancers</SheetTitle>
                    <SheetDescription>
                        Changed your mind? Click cancel button to cancel any invitation.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid flex-1 px-4 overflow-y-auto scroll-smooth">
                    {isLoading && (
                        <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                            <Spinner className="w-12 h-12 text-(--my-blue)" />
                        </div>
                    )}

                    {isError && (
                        <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                            <p className="text-red-600">Error in getting invitations!</p>
                        </div>
                    )}

                    {data && data.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500">
                            <div className="bg-(--my-blue)/10 text-(--my-blue) rounded-full p-4 mb-4">
                                <BadgeAlert size={40} />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700">
                                No Invitations Yet
                            </h3>
                            <p className="text-sm mt-1 text-gray-500 max-w-60">
                                You have not invited any freelancers to this project yet.
                            </p>
                        </div>
                    )}

                    {data && data.length >= 1 && (
                        <div>
                            {data.map((item) => (
                                <InvitedFreelancersSidebarCards
                                    key={item.id}
                                    invitationData={item}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="custom">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default InvitedFreelancersSidebar;
