import { Outlet, Navigate } from "react-router-dom";
import { userStore } from "@/stores/user-store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client-sidebar";
import UserNotificationsComponent from "@/components/user-notifications-component";

const ClientLayout = () => {
    const user = userStore((state) => state.user);
    if (!user) return <Navigate to="/login" />;
    else if (user && user.role === "freelancer") return <Navigate to="/freelancer" />;
    return (
        <div>
            <SidebarProvider>
                <ClientSidebar />
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

export default ClientLayout;
