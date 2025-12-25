import type { ChatFromBackendType, UserType } from "@/Types";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type PropsType = {
    activeChat: ChatFromBackendType | null;
    setActiveChat: (chat: ChatFromBackendType) => void;
    chatsData: ChatFromBackendType[];
    user: UserType;
};

const ChatsList = ({ chatsData, setActiveChat, activeChat, user }: PropsType) => {
    return (
        <div className="w-full h-full border-2 flex flex-col">
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {chatsData.map((item) => {
                        const isActive = item.id === activeChat?.id;

                        let isUnread = false;
                        if (
                            !isActive &&
                            user.role === "client" &&
                            item.last_updated_by !== user.id &&
                            item.latest_message_id > item.message_id_read_by_client
                        ) {
                            isUnread = true;
                        } else if (
                            (!isActive &&
                                user.role === "freelancer" &&
                                item.message_id_read_by_freelancer &&
                                item.last_updated_by !== user.id &&
                                item.latest_message_id >
                                    item.message_id_read_by_freelancer) ||
                            (!isActive &&
                                user.role === "freelancer" &&
                                !item.message_id_read_by_freelancer)
                        ) {
                            isUnread = true;
                        }
                        const profilePic =
                            item.client?.profile_pic ||
                            item.freelancer?.profile_pic ||
                            "https://bubkykiqcwqclwcgcrlb.supabase.co/storage/v1/object/public/freelansync-media/profile-pics/default-pfp.png";
                        const username =
                            item.client?.username ||
                            item.freelancer?.username ||
                            "Placeholder";
                        return (
                            <div
                                key={item.id}
                                onClick={() => setActiveChat(item)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer  transition-colors border-b
                                ${
                                    isActive
                                        ? "bg-gray-200"
                                        : isUnread
                                        ? "bg-blue-50 hover:bg-blue-100"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage
                                            src={profilePic}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>{username}</AvatarFallback>
                                    </Avatar>

                                    {isUnread && (
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div
                                        className={`font-medium ${
                                            isUnread
                                                ? "font-semibold text-gray-900"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {username}
                                    </div>
                                    <div
                                        className={`text-sm truncate ${
                                            isUnread ? "text-gray-700" : "text-gray-500"
                                        }`}
                                    >
                                        {isUnread
                                            ? "New message received!"
                                            : `Click to chat with ${username}`}
                                    </div>
                                </div>
                                {isUnread && (
                                    <div className="flex justify-center items-center">
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatsList;
