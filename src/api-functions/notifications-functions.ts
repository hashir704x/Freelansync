import { supabaseClient } from "@/supabase-client";
import type { NotificationsFromBackendType } from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

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

export async function setAllNotificationsToRead(userId: string): Promise<void> {
    const { error } = await supabaseClient
        .from("notifications")
        .update({ read: true })
        .eq("to_user_id", userId)
        .eq("read", false);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function deleteAllNotifications(userId: string): Promise<void> {
    const { error } = await supabaseClient
        .from("notifications")
        .delete()
        .eq("to_user_id", userId);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}
