import {
    CircleX,
    Inbox,
    LogOut,
    User,
    MailQuestionMark,
    FolderKanban,
    MessageCircleMore,
} from "lucide-react";

import { userStore } from "@/stores/user-store";
import { supabaseClient } from "@/supabase-client";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllChatsForUser } from "@/api-functions/chats-functions";
import type { UserType } from "@/Types";

const items = [
    {
        title: "Dashboard",
        url: "/freelancer",
        icon: Inbox,
    },
    {
        title: "My Projects",
        url: "/freelancer/all-projects",
        icon: FolderKanban,
    },
    {
        title: "My Profile",
        url: "/freelancer/freelancer-profile-own",
        icon: User,
    },
    {
        title: "Invitations",
        url: "/freelancer/freelancer-invitations",
        icon: MailQuestionMark,
    },
    {
        title: "Chats",
        url: "/freelancer/chats",
        icon: MessageCircleMore,
    },
];

export default function FreelancerSidebar() {
    const isMobile = useIsMobile();
    const user = userStore((state) => state.user) as UserType;
    const activeChat = userStore((state) => state.activeChat);

    const { toggleSidebar } = useSidebar();
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryFn: () => getAllChatsForUser({ userRole: "freelancer" }),
        queryKey: ["get-all-chats-for-user"],
        refetchInterval: 5 * 60 * 1000,
        refetchIntervalInBackground: true,
    });

    // zustand states
    const resetUser = userStore((state) => state.resetUser);

    async function handleLogout() {
        resetUser();
        await supabaseClient.auth.signOut();
        queryClient.clear();
    }

    let showUnreadBadge = false;
    if (data) {
        data.forEach((item) => {
            if (
                !item.message_id_read_by_freelancer ||
                (item.last_updated_by !== user.id &&
                    item.id !== activeChat?.id &&
                    item.latest_message_id > item.message_id_read_by_freelancer)
            ) {
                showUnreadBadge = true;
            }
        });
    }

    return (
        <div className="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
            <Sidebar className="border">
                <SidebarHeader>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-xl">Freelansync</span>{" "}
                        <CircleX className="md:hidden" onClick={toggleSidebar} />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-2">
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                onClick={() => {
                                                    if (isMobile) toggleSidebar();
                                                }}
                                            >
                                                <item.icon />{" "}
                                                <div className="flex items-center gap-2">
                                                    {item.title}{" "}
                                                    {item.title === "Chats" &&
                                                        showUnreadBadge && (
                                                            <span className="text-[10px] bg-(--my-blue) py-1 px-2 rounded-full text-white">
                                                                New messages
                                                            </span>
                                                        )}
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="hover:bg-gray-100">
                    <button
                        onClick={handleLogout}
                        className="py-3 px-6 flex items-center gap-3 font-semibold cursor-pointer text-sm"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </SidebarFooter>
            </Sidebar>
        </div>
    );
}
