import { supabaseClient } from "@/supabase-client";
import type { NotificationsFromBackendType } from "@/Types";

export async function getAllNotificationsForUser(
    userId: string
): Promise<NotificationsFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("notifications")
        .select("*")
        .eq("to_user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error.message);
        throw new Error();
    }

    return data;
}
