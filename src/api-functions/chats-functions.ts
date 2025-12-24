import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";

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
    // message,
}: {
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
