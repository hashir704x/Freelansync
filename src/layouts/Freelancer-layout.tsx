import { Outlet, Navigate } from "react-router-dom";
import { userStore } from "@/stores/user-store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FreelancerSidebar from "@/components/freelancer-sidebar";
import UserNotificationsComponent from "@/components/user-notifications-component";

const FreelancerLayout = () => {
    const user = userStore((state) => state.user);
    if (!user) return <Navigate to="/login" />;
    else if (user && user.role === "client") <Navigate to="/client" />;
    return (
        <div>
            <SidebarProvider>
                <FreelancerSidebar />
                <div className="w-full relative">
                    <SidebarTrigger className="cursor-pointer absolute top-4 left-2" />
                    <Outlet />

                    <div className="absolute top-6 right-8">
                        <UserNotificationsComponent />
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default FreelancerLayout;
