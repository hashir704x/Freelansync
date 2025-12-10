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

export async function updateClientProfileImage({
    clientId,
    file,
}: {
    clientId: string;
    file: File;
}): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabaseClient.storage
        .from("freelansync-media")
        .upload(`profile-pics/${fileName}`, file, {
            upsert: false,
            cacheControl: "3600",
            contentType: file.type,
        });
    if (uploadError) {
        throw new Error(uploadError.message || "Error in uploading image");
    }

    const { data: imageData } = supabaseClient.storage
        .from("freelansync-media")
        .getPublicUrl(`profile-pics/${fileName}`);
    if (!imageData.publicUrl) {
        throw new Error("Error in uploading image");
    }

    const { error: updateImageError } = await supabaseClient
        .from("clients")
        .update({ profile_pic: imageData.publicUrl })
        .eq("id", clientId);

    if (updateImageError) {
        throw new Error(updateImageError.message || "Error in uploading image");
    }

    return imageData.publicUrl;
}
