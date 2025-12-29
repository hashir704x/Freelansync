import {
    getMessagesForChat,
    sendMessage,
    updateLastReadMessageCol,
} from "@/api-functions/chats-functions";
import type { ChatFromBackendType, MessageFromBackendType, UserType } from "@/Types";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import { Download, FileText, Paperclip, Send } from "lucide-react";
import { toast } from "sonner";
import { supabaseClient } from "@/supabase-client";
import ShareFileDialog from "./share-file-dialog";
import ImageViewPopup from "./image-view-popup";
import { useQueryClient } from "@tanstack/react-query";

const ChatWindow = ({
    activeChat,
    user,
}: {
    activeChat: ChatFromBackendType;
    user: UserType;
}) => {
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState<MessageFromBackendType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [sendingMessageLoading, setSendingMessageLoading] = useState(false);
    const [openShareFileDialog, setOpenShareFileDialog] = useState(false);
    const [targetFile, setTargetFile] = useState<null | File>(null);
    
    const [showImageView, setShowImageView] = useState(false);
    const [imageViewUrl, setImageViewUrl] = useState<null | string>(null);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const messagesRef = useRef<null | number>(null);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const data = await getMessagesForChat(activeChat.id);
                setMessages(data);
            } catch (error) {
                setError("Failed to get chat messages");
            } finally {
                setLoading(false);
            }
        })();

        const channel = supabaseClient
            .channel(`chat_${activeChat.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${activeChat.id}`,
                },
                (payload) => {
                    const newMessage = payload.new as MessageFromBackendType;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return function () {
            if (channel) supabaseClient.removeChannel(channel);

            (async function () {
                try {
                    if (messagesRef.current) {
                        await updateLastReadMessageCol({
                            chatId: activeChat.id,
                            userRole: user.role,
                            latestMessageId: messagesRef.current,
                        });
                        queryClient.invalidateQueries({
                            queryKey: ["get-all-chats-for-user"],
                        });
                    }
                } catch (error) {
                    toast.error("Something went wrong in process");
                }
            })();
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        if (messages.length > 0) {
            messagesRef.current = messages[messages.length - 1].id;
        }
    }, [messages]);

    async function handleSend() {
        if (!inputValue.trim()) return;
        try {
            setSendingMessageLoading(true);
            await sendMessage({
                chatId: activeChat.id,
                messageText: inputValue.trim(),
                senderId: user.id,
                senderRole: user.role,
            });
            setInputValue("");
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setSendingMessageLoading(false);
        }
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        setTargetFile(e.target.files[0]);
        setOpenShareFileDialog(true);
        e.target.value = "";
    }

    return (
        <div className="flex flex-col w-full h-full bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <Avatar className="h-11 w-11 border">
                    <AvatarImage
                        src={
                            activeChat.client?.profile_pic ||
                            activeChat.freelancer?.profile_pic ||
                            "https://bubkykiqcwqclwcgcrlb.supabase.co/storage/v1/object/public/freelansync-media/profile-pics/default-pfp.png"
                        }
                        alt="username"
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                        {activeChat.client?.username ||
                            activeChat.freelancer?.username ||
                            "Dummy username"}
                    </AvatarFallback>
                </Avatar>

                <span className="font-semibold text-gray-900 text-lg">
                    {activeChat.client?.username ||
                        activeChat.freelancer?.username ||
                        "Dummy username"}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {loading ? (
                    <div className="flex justify-center items-center mt-56">
                        <Spinner className="text-(--my-blue) w-8 h-8" />
                    </div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    messages.map((item) => {
                        const isSentByCurrentUser = user.role === item.sender_role;
                        return (
                            <div
                                key={item.id}
                                className={`flex ${
                                    isSentByCurrentUser ? "justify-end" : "justify-start"
                                } mb-4`}
                            >

                                {item.file_type ? (
                                    <div>
                                        {item.file_type.match(/(jpg|jpeg|png|webp)$/i) ? (
                                            <img
                                                src={item.message_text}
                                                alt="shared file"
                                                className={`rounded-xl border shadow-md w-[350px] cursor-pointer transition-transform hover:scale-105`}
                                                onClick={() => {
                                                    setImageViewUrl(item.message_text);
                                                    setShowImageView(true);
                                                }}
                                            />
                                        ) : (
                                            <div
                                                // onClick={() =>
                                                //     handleFileDownload(
                                                //         item.message_text,
                                                //         item.file_type as string
                                                //     )
                                                // }
                                                className={`group flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl shadow-sm transition-all
                ${
                    isSentByCurrentUser
                        ? "bg-(--my-blue) text-white hover:bg-(--my-blue-light)"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                                            >
                                                {/* File & Download icons */}
                                                <div className="flex items-center gap-3 text-3xl">
                                                    <FileText
                                                        size={28}
                                                        className={`transition-transform group-hover:scale-110 ${
                                                            isSentByCurrentUser
                                                                ? "text-white"
                                                                : "text-gray-700"
                                                        }`}
                                                    />
                                                    <Download
                                                        size={26}
                                                        className={`transition-transform group-hover:scale-110 ${
                                                            isSentByCurrentUser
                                                                ? "text-white"
                                                                : "text-gray-700"
                                                        }`}
                                                    />
                                                </div>

                                                {/* File type text */}
                                                <span className="font-semibold text-sm capitalize">
                                                    {item.file_type.toUpperCase()} File
                                                </span>

                                                {/* Subtext */}
                                                <span
                                                    className={`text-xs ${
                                                        isSentByCurrentUser
                                                            ? "text-white/80"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Click to download
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-[50%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                            isSentByCurrentUser
                                                ? "bg-(--my-blue) text-white rounded-tr-none"
                                                : "bg-gray-200 text-gray-800 rounded-tl-none"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap wrap-break-word">
                                            {item.message_text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center gap-2">
                    {imageViewUrl && showImageView && (
                        <ImageViewPopup
                            imageViewUrl={imageViewUrl}
                            setImageViewUrl={setImageViewUrl}
                            setShowImageView={setShowImageView}
                            showImageView={showImageView}
                        />
                    )}
                    <input
                        disabled={sendingMessageLoading}
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm sm:text-base"
                    />
                    <button
                        disabled={sendingMessageLoading || !inputValue.trim()}
                        onClick={handleSend}
                        className="disabled:bg-(--my-blue)/50 p-2 rounded-xl bg-(--my-blue)  hover:bg-(--my-blue-light) transition text-white"
                    >
                        <Send size={18} />
                    </button>
                    <label className="cursor-pointer p-2 rounded-xl hover:bg-gray-200 transition flex items-center justify-center">
                        <Paperclip
                            size={20}
                            className="text-gray-600 hover:text-gray-800"
                        />
                        <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        {targetFile && (
                            <ShareFileDialog
                                openShareFileDialog={openShareFileDialog}
                                setOpenShareFileDialog={setOpenShareFileDialog}
                                targetFile={targetFile}
                                setTargetFile={setTargetFile}
                                activeChatId={activeChat.id}
                            />
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
