// import { getMessagesForProject } from "@/api-functions/project-functions";
// import { Spinner } from "@/components/ui/spinner";
// import { userStore } from "@/stores/user-store";
// import type { ProjectMessageFromBackendType, UserType } from "@/Types";
// import { MessageSquare } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const ProjectChatPage = () => {
//     const { projectId } = useParams();
//     const user = userStore((state) => state.user) as UserType;

//     const [messages, setMessages] = useState<ProjectMessageFromBackendType[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isError, setIsError] = useState(false);
//     const [inputValue, setInputValue] = useState("");

//     useEffect(() => {
//         (async function () {
//             try {
//                 setIsLoading(true);
//                 const messagesData = await getMessagesForProject({
//                     projectId: projectId as string,
//                 });
//                 setMessages(messagesData);
//             } catch (error) {
//                 console.error(error);
//                 setIsError(true);
//             } finally {
//                 setIsLoading(false);
//             }
//         })();
//     }, []);
//     console.log(messages);
//     return (
//         <div>
//             <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
//                 Project Group Chat
//             </h1>

//             {isLoading && (
//                 <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
//                     <Spinner className="size-8 text-(--my-blue)" />
//                 </div>
//             )}

//             {isError && (
//                 <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
//                     <p>Error in getting Project messages! </p>
//                 </div>
//             )}

//             {!isLoading && !isError && (
//                 <div>
//                     {messages.length === 0 && (
//                         <div>
//                             {messages.length === 0 && (
//                                 <div className="flex flex-col items-center justify-center text-gray-400 border w-full">
//                                     <div className="bg-(--my-blue)/10 p-4 rounded-full shadow-sm">
//                                         <MessageSquare
//                                             size={30}
//                                             className="text-(--my-blue)"
//                                         />
//                                     </div>
//                                     <p className="mt-4 text-lg font-medium text-gray-600">
//                                         No messages yet
//                                     </p>
//                                     <p className="text-sm text-gray-400">
//                                         Start the conversation by sending a message
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProjectChatPage;


const ProjectChatPage = () => {
    return <div>ProjectChatPage</div>;
};

export default ProjectChatPage;
