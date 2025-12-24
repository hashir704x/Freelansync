import { getAllChatsForUser } from "@/api-functions/chats-functions";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";
import ChatsList from "@/components/chats-components/chats-list";

const ChatPage = () => {
    const isMobile = useIsMobile();
    const user = userStore((state) => state.user) as UserType;
    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllChatsForUser({ userRole: user.role }),
        queryKey: ["get-all-chats-for-user"],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                My Chats
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Chats data</p>
                </div>
            )}
            {data && data.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-70px)]">
                    <div className="p-2 border bg-gray-200 rounded-lg">
                        <MessageCircleMore size={25} fill="true" />
                    </div>
                    <h2 className="text-xl font-medium mt-2">No Chats Yet</h2>
                    <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                        You haven't created any chats yet.
                    </p>
                </div>
            )}
            {data && data.length >= 1 && (
                <div>
                    {isMobile ? (
                        <div>Mobile view</div>
                    ) : (
                        <div>
                            <ChatsList chatsData={data} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatPage;
