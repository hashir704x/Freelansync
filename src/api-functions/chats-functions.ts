import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type { ChatFromBackendType, MessageFromBackendType } from "@/Types";

export async function checkChatExistance({ freelancerId }: { freelancerId: string }) {
    const { data, error } = await supabaseClient
        .from("chats")
        .select("id")
        .eq("freelancer", freelancerId);

    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
    return data;
}

export async function createNewChatByClient({
    clientId,
    freelancerId,
    message,
}: {
    clientId: string;
    freelancerId: string;
    message: string;
}): Promise<void> {
    const { error, data } = await supabaseClient
        .from("chats")
        .insert([
            {
                client: clientId,
                freelancer: freelancerId,
                last_updated_by: clientId,
            },
        ])
        .select("id")
        .single();
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const { error: messageError, data: messageResponse } = await supabaseClient
        .from("messages")
        .insert([
            {
                chat_id: data.id,
                sender_role: "client",
                sender_id: clientId,
                message_text: message,
            },
        ])
        .select("id")
        .single();
    if (messageError) {
        console.error(messageError.message);
        throw new Error(errorMessageMaker(messageError.message));
    }

    const newMessageId = messageResponse.id;
    const { error: chatUpdateError } = await supabaseClient
        .from("chats")
        .update({
            latest_message_id: newMessageId,
            message_id_read_by_client: newMessageId,
        })
        .eq("id", data.id);

    if (chatUpdateError) {
        console.error(
            "Error occurred in createChatAndInsertMessage function",
            chatUpdateError.message
        );
        throw new Error(chatUpdateError.message);
    }
}

export async function getAllChatsForUser({
    userRole,
}: {
    userRole: "client" | "freelancer";
}): Promise<ChatFromBackendType[]> {
    if (userRole === "client") {
        const { data, error } = await supabaseClient
            .from("chats")
            .select(
                "id, created_at, latest_message_id, last_updated_by, message_id_read_by_client, message_id_read_by_freelancer, freelancer(id, username, profile_pic)"
            )
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error.message);
            throw new Error();
        }
        return data as unknown as ChatFromBackendType[];
    } else {
        const { data, error } = await supabaseClient
            .from("chats")
            .select(
                "id, created_at, latest_message_id, last_updated_by, message_id_read_by_client, message_id_read_by_freelancer, client(id, username, profile_pic)"
            )
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error.message);
            throw new Error();
        }
        return data as unknown as ChatFromBackendType[];
    }
}

export async function getMessagesForChat(
    chatId: string
): Promise<MessageFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function sendMessage({
    chatId,
    messageText,
    senderId,
    senderRole,
}: {
    chatId: string;
    senderId: string;
    senderRole: "client" | "freelancer";
    messageText: string;
}): Promise<void> {
    const { error, data } = await supabaseClient
        .from("messages")
        .insert([
            {
                chat_id: chatId,
                sender_id: senderId,
                sender_role: senderRole,
                message_text: messageText,
            },
        ])
        .select("id")
        .single();
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    let targetCol = "message_id_read_by_client";
    if (senderRole === "freelancer") targetCol = "message_id_read_by_freelancer";

    const { error: chatUpdateError } = await supabaseClient
        .from("chats")
        .update({
            latest_message_id: data.id,
            last_updated_by: senderId,
            [targetCol]: data.id,
        })
        .eq("id", chatId);

    if (chatUpdateError) {
        console.error(chatUpdateError.message);
        throw new Error(errorMessageMaker(chatUpdateError.message));
    }
}

export async function uploadChatMedia({
    file,
    senderId,
    senderRole,
    chatId,
}: {
    file: File;
    senderId: string;
    senderRole: "client" | "freelancer";
    chatId: string;
}): Promise<void> {
    const fileName = `${Date.now()}_${senderId}_${file.name}`;

    const { error } = await supabaseClient.storage
        .from("freelansync-media")
        .upload(`chat-media/${fileName}`, file, {
            upsert: false,
            cacheControl: "3600",
            contentType: file.type,
        });
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const { data: fileData } = supabaseClient.storage
        .from("freelansync-media")
        .getPublicUrl(`chat-media/${fileName}`);
    if (!fileData.publicUrl) {
        console.error("Error! Failed to get file public url");
        throw new Error(
            errorMessageMaker("Failed to upload file, Failed to get public url")
        );
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "file";

    const { error: messageError } = await supabaseClient.from("messages").insert([
        {
            chat_id: chatId,
            sender_id: senderId,
            sender_role: senderRole,
            message_text: fileData.publicUrl,
            file_type: ext,
        },
    ]);
    if (messageError) {
        console.error(messageError.message);
        throw new Error(errorMessageMaker(messageError.message));
    }
}
