import { getAllNotificationsForUser } from "@/api-functions/notifications-functions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { Bell, Dot } from "lucide-react";

const ClientNotificationsComponent = () => {
    const user = userStore((state) => state.user) as UserType;

    const { data, isLoading } = useQuery({
        queryFn: () => getAllNotificationsForUser(user.id),
        queryKey: ["notifications", user.id],
    });

    const unreadCount = data?.filter((n) => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative outline-none">
                <Bell size={22} className="cursor-pointer text-[--my-blue]" />

                {unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-xs font-semibold text-white">
                        {unreadCount}
                    </span>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-3 w-[340px] rounded-xl p-0 shadow-lg">
                <DropdownMenuLabel className="px-4 py-3 text-sm font-semibold">
                    Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isLoading && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                        Loading notifications...
                    </div>
                )}

                {data && data.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No notifications yet
                    </div>
                )}

                {data && data.length > 0 && (
                    <div className="max-h-[360px] overflow-y-auto">
                        {data.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-gray-100 ${
                                    !item.read ? "bg-gray-50" : ""
                                }`}
                            >
                                {!item.read && (
                                    <Dot className="mt-1 h-6 w-6 text-blue-500" />
                                )}

                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {item.content}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}

                <DropdownMenuSeparator />

                <div className="flex items-center justify-between px-4 py-3">
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                        Mark all as read
                    </button>
                    <button className="text-sm text-red-500 hover:text-red-600">
                        Clear all
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ClientNotificationsComponent;
