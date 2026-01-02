import { getAllChatsForUser } from "@/api-functions/chats-functions";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleMore, MessageSquare } from "lucide-react";
import ChatsList from "@/components/chats-components/chats-list";
import ChatWindow from "@/components/chats-components/chat-window";
import { useEffect } from "react";

const ChatPage = () => {
    const isMobile = useIsMobile();
    const user = userStore((state) => state.user) as UserType;
    const activeChat = userStore((state) => state.activeChat);
    const setActiveChat = userStore((state) => state.setActiveChat);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllChatsForUser({ userRole: user.role }),
        queryKey: ["get-all-chats-for-user"],
        refetchInterval: 20 * 1000,
        refetchIntervalInBackground: true,
    });

    useEffect(() => {
        return function () {
            setActiveChat(null);
        };
    }, []);

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
                        <div className="h-[calc(100vh-70px)]">
                            {!activeChat ? (
                                <div className="h-full ">
                                    <ChatsList
                                        chatsData={data}
                                        activeChat={activeChat}
                                        setActiveChat={setActiveChat}
                                        user={user}
                                    />
                                </div>
                            ) : (
                                <div className="h-full">
                                    <ChatWindow
                                        activeChat={activeChat}
                                        key={activeChat.id}
                                        user={user}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[calc(100vh-70px)] flex">
                            <div className="min-w-72 h-full">
                                <ChatsList
                                    chatsData={data}
                                    activeChat={activeChat}
                                    setActiveChat={setActiveChat}
                                    user={user}
                                />
                            </div>

                            {activeChat ? (
                                <ChatWindow
                                    activeChat={activeChat}
                                    key={activeChat.id}
                                    user={user}
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50">
                                    <div className="flex flex-col items-center space-y-4 max-w-sm px-6">
                                        <div className="p-6 bg-blue-100 rounded-full">
                                            <MessageSquare className="w-10 h-10 text-blue-600" />
                                        </div>

                                        <h2 className="text-2xl font-semibold text-gray-700">
                                            No chat selected
                                        </h2>

                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            Select a chat from the list to start
                                            messaging.
                                            <br />
                                            Your conversations will appear here.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatPage;
