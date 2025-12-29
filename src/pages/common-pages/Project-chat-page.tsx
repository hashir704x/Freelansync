import { supabaseClient } from "@/supabase-client";
import type { ProjectMessageFromBackendType, UserType } from "@/Types";
import { Spinner } from "@/components/ui/spinner";
import { Download, FileText, MessageSquare, Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userStore } from "@/stores/user-store";
import {
    getMessagesForProject,
    getProjectDetailsById,
    sendProjectChatMessage,
} from "@/api-functions/project-functions";
import ProjectChatShareFileDialog from "@/components/chats-components/project-chat-share-file-dialog";
import ImageViewPopup from "@/components/chats-components/image-view-popup";

const ProjectChatPage = () => {
    const { projectId } = useParams();
    const user = userStore((state) => state.user) as UserType;
    const [messages, setMessages] = useState<ProjectMessageFromBackendType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [sendingMessageLoading, setSendingMessageLoading] = useState(false);
    const [targetFile, setTargetFile] = useState<null | File>(null);
    const [openProjectChatShareFileDialog, setOpenProjectChatShareFileDialog] =
        useState(false);

    const [showImageView, setShowImageView] = useState(false);
    const [imageViewUrl, setImageViewUrl] = useState<null | string>(null);

    const {
        data,
        isLoading: extraDataLoading,
        isError: extraDataError,
    } = useQuery({
        queryFn: () => getProjectDetailsById(projectId as string),
        queryKey: ["get-project-details", projectId],
    });

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const messagesData = await getMessagesForProject({
                    projectId: projectId as string,
                });
                setMessages(messagesData);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();

        const channel = supabaseClient
            .channel(`project_chat_${projectId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "project_messages",
                    filter: `project=eq.${projectId}`,
                },
                (payload) => {
                    const newMessage = payload.new as ProjectMessageFromBackendType;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            if (channel) {
                console.log("Unsubscribing channel");
                supabaseClient.removeChannel(channel);
            }
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        try {
            setSendingMessageLoading(true);
            await sendProjectChatMessage({
                projectId: projectId as string,
                userId: user.id,
                senderUsername: user.username,
                messageText: inputValue.trim(),
            });
            setInputValue("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSendingMessageLoading(false);
        }
    };

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        setTargetFile(e.target.files[0]);
        setOpenProjectChatShareFileDialog(true);
        e.target.value = "";
    }

    if (isError)
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Failed to load project messages.
            </div>
        );

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-white shadow-sm overflow-hidden">
            {/* Chat Section */}
            <div className="flex flex-col flex-1">
                <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                    Project Chat
                </h1>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 ">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[90%]">
                            <Spinner className="text-(--my-blue) w-8 h-8" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-[20%] text-gray-400">
                            <div className="bg-(--my-blue)/10 p-4 rounded-full shadow-sm">
                                <MessageSquare size={30} className="text-(--my-blue)" />
                            </div>
                            <p className="mt-4 text-lg font-medium text-gray-600">
                                No messages yet
                            </p>
                            <p className="text-sm text-gray-400">
                                Start the conversation by sending a message
                            </p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isSentByUser = msg.sender === user.id;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        isSentByUser ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {msg.file_type ? (
                                        <div>
                                            {msg.file_type.match(
                                                /(jpg|jpeg|png|webp|avif)$/i
                                            ) ? (
                                                <img
                                                    src={msg.message_text}
                                                    alt="shared file"
                                                    className={`rounded-xl border shadow-md w-[350px] cursor-pointer transition-transform hover:scale-105`}
                                                    onClick={() => {
                                                        setImageViewUrl(msg.message_text);
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
                    isSentByUser
                        ? "bg-(--my-blue) text-white hover:bg-(--my-blue-light)"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                                                >
                                                    {/* File & Download icons */}
                                                    <div className="flex items-center gap-3 text-3xl">
                                                        <FileText
                                                            size={28}
                                                            className={`transition-transform group-hover:scale-110 ${
                                                                isSentByUser
                                                                    ? "text-white"
                                                                    : "text-gray-700"
                                                            }`}
                                                        />
                                                        <Download
                                                            size={26}
                                                            className={`transition-transform group-hover:scale-110 ${
                                                                isSentByUser
                                                                    ? "text-white"
                                                                    : "text-gray-700"
                                                            }`}
                                                        />
                                                    </div>

                                                    {/* File type text */}
                                                    <span className="font-semibold text-sm capitalize">
                                                        {msg.file_type.toUpperCase()} File
                                                    </span>

                                                    {/* Subtext */}
                                                    <span
                                                        className={`text-xs ${
                                                            isSentByUser
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
                                            className={`max-w-[75%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                                isSentByUser
                                                    ? "bg-(--my-blue) text-white rounded-tr-none"
                                                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                                            }`}
                                        >
                                            {!isSentByUser && (
                                                <div className="text-xs text-gray-500 mb-1 font-medium">
                                                    {msg.sender_username}
                                                </div>
                                            )}
                                            <p className="whitespace-pre-wrap wrap-break-word">
                                                {msg.message_text}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="flex-none border-t border-gray-200 p-3 bg-gray-50">
                    {imageViewUrl && showImageView && (
                        <ImageViewPopup
                            imageViewUrl={imageViewUrl}
                            setImageViewUrl={setImageViewUrl}
                            setShowImageView={setShowImageView}
                            showImageView={showImageView}
                        />
                    )}
                    <div className="flex items-center gap-2">
                        <input
                            disabled={sendingMessageLoading}
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-(--my-blue) transition-all text-sm sm:text-base"
                        />
                        <button
                            disabled={sendingMessageLoading || !inputValue.trim()}
                            onClick={handleSend}
                            className="disabled:bg-(--my-blue)/50 p-2 rounded-xl bg-(--my-blue) hover:bg-(--my-blue-light) transition text-white"
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
                                <ProjectChatShareFileDialog
                                    projectId={projectId as string}
                                    openProjectChatShareFileDialog={
                                        openProjectChatShareFileDialog
                                    }
                                    setOpenProjectChatShareFileDialog={
                                        setOpenProjectChatShareFileDialog
                                    }
                                    setTargetFile={setTargetFile}
                                    targetFile={targetFile}
                                />
                            )}
                        </label>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex flex-col w-[300px] border-l bg-gray-50 p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Project Members
                </h2>

                {extraDataLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner className="text-(--my-blue) w-7 h-7" />
                    </div>
                ) : extraDataError || !data ? (
                    <p className="text-red-500 text-sm">Failed to load members</p>
                ) : (
                    <div className="space-y-6">
                        {/* Client Section */}
                        <div className="border-b pb-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                Client
                            </h3>
                            <div className="flex items-center gap-3">
                                <img
                                    src={data.client.profile_pic}
                                    alt="client-pic"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-(--my-blue)"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {data.client.username}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {data.client.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Freelancers Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                Freelancers
                            </h3>
                            {data.project_and_freelancer_link.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                    No freelancers yet
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {data.project_and_freelancer_link.map((f) => (
                                        <div
                                            key={f.freelancer.id}
                                            className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-2 hover:shadow-md transition-all duration-200"
                                        >
                                            <img
                                                src={f.freelancer.profile_pic}
                                                alt="freelancer-pic"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {f.freelancer.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {f.freelancer.role}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectChatPage;
