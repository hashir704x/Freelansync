import { supabaseClient } from "@/supabase-client";
import type { ClientProfileOwnDataFromBackendType } from "@/Types";

export async function getClientProfileOwnDataById(
    clientId: string
): Promise<ClientProfileOwnDataFromBackendType> {
    const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();
    if (error) {
        throw new Error(error.message || "failed to fetch client profile data");
    }

    return data;
}
