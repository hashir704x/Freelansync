import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type { ChatFromBackendType } from "@/Types";

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
}: // message,
{
    clientId: string;
    freelancerId: string;
    message: string;
}): Promise<void> {
    const { error } = await supabaseClient.from("chats").insert([
        {
            client: clientId,
            freelancer: freelancerId,
        },
    ]);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
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
            .select("id, created_at, freelancer(id, username, profile_pic)")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error.message);
            throw new Error();
        }
        return data as unknown as ChatFromBackendType[];
    } else {
        const { data, error } = await supabaseClient
            .from("chats")
            .select("id, created_at, client(id, username, profile_pic)")
            .order("created_at", { ascending: false });
        if (error) {
            console.error(error.message);
            throw new Error();
        }
        return data as unknown as ChatFromBackendType[];
    }
}
