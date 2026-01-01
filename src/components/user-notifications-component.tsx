import {
    deleteAllNotifications,
    getAllNotificationsForUser,
    setAllNotificationsToRead,
} from "@/api-functions/notifications-functions";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useNavigate } from "react-router-dom";

const UserNotificationsComponent = () => {
    const queryClient = useQueryClient();
    const user = userStore((state) => state.user) as UserType;
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryFn: () => getAllNotificationsForUser(user.id),
        queryKey: ["get-all-notifications-for-user"],
        refetchInterval: 2 * 60 * 1000,
        refetchIntervalInBackground: true,
    });

    const unreadCount = data?.filter((n) => !n.read).length;

    const { isPending, mutate } = useMutation({
        mutationFn: setAllNotificationsToRead,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["get-all-notifications-for-user"],
            });
        },
        onError(error) {
            toast.error(`Failed to update notifications: ${error.message}`);
        },
    });

    const { isPending: deletePending, mutate: deleteMutation } = useMutation({
        mutationFn: deleteAllNotifications,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["get-all-notifications-for-user"],
            });
        },
        onError(error) {
            toast.error(`Failed to delete notifications: ${error.message}`);
        },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Bell size={22} className="cursor-pointer text-[--my-blue]" />
                {data && (unreadCount as number) > 0 && (
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
                    <div className="max-h-[380px] overflow-y-auto">
                        {data.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                className={`flex items-start gap-3 px-4 py-3 transition hover:bg-gray-100 ${
                                    !item.read ? "bg-gray-100" : ""
                                }`}
                            >
                                {!item.read && (
                                    <div className="mt-4 min-w-2 min-h-2 rounded-full bg-blue-800" />
                                )}

                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {item.content}
                                    </span>
                                    {item.type !== "Invitation_Rejected" && (
                                        <button
                                            onClick={() => {
                                                if (user.role === "client") {
                                                    if (
                                                        item.type ===
                                                            "Invitation_Accepted" &&
                                                        item.project_id
                                                    ) {
                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-project-details",
                                                                item.project_id,
                                                            ],
                                                        });
                                                        navigate(
                                                            `/client/project-details/${item.project_id}`
                                                        );
                                                    } else if (
                                                        item.type ===
                                                            "Milestone_Submitted" &&
                                                        item.milestone_id
                                                    ) {
                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-all-milestones-for-project",
                                                                item.project_id,
                                                            ],
                                                        });

                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-milestone-details-by-id",
                                                                item.milestone_id,
                                                            ],
                                                        });

                                                        navigate(
                                                            `/client/project-details/${item.project_id}`
                                                        );
                                                    } else if (
                                                        item.type === "Dispute_Raised"
                                                    ) {
                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-project-details",
                                                                item.project_id,
                                                            ],
                                                        });

                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-all-milestones-for-project",
                                                                item.project_id,
                                                            ],
                                                        });

                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-all-projects-for-client",
                                                            ],
                                                        });

                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-recent-milestones-for-user",
                                                            ],
                                                        });
                                                        
                                                        navigate(
                                                            `/client/project-details/${item.project_id}`
                                                        );
                                                    }
                                                } else {
                                                    if (
                                                        item.type ===
                                                        "Invitation_Recieved"
                                                    ) {
                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-invitattions-for-freelancer",
                                                            ],
                                                        });
                                                        navigate(
                                                            `/freelancer/freelancer-invitations`
                                                        );
                                                    } else if (
                                                        item.type === "Milestone_Assigned"
                                                    ) {
                                                        queryClient.invalidateQueries({
                                                            queryKey: [
                                                                "get-all-milestones-for-project",
                                                                item.project_id,
                                                            ],
                                                        });
                                                        navigate(
                                                            `/freelancer/project-details/${item.project_id}`
                                                        );
                                                    }
                                                }
                                            }}
                                            className="bg-(--my-blue) py-1 w-[100px] rounded-md mt-2 text-white cursor-pointer"
                                        >
                                            Show me
                                        </button>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}

                        <div className="flex items-center justify-between px-4 py-3">
                            <button
                                onClick={() => mutate(user.id)}
                                disabled={isPending}
                                className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex gap-2 items-center"
                            >
                                {isPending && <Spinner />} Mark all as read
                            </button>
                            <button
                                disabled={deletePending}
                                onClick={() => deleteMutation(user.id)}
                                className="flex gap-2 items-center cursor-pointer text-sm text-red-500 hover:text-red-600"
                            >
                                {deletePending && <Spinner />} Clear all
                            </button>
                        </div>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserNotificationsComponent;
