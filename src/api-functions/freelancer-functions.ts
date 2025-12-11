import { supabaseClient } from "@/supabase-client";
import type { FreelancerProfileOwnDataFromBackendType } from "@/Types";

export async function getFreelancerProfileOwnDataById(
    freelancerId: string
): Promise<FreelancerProfileOwnDataFromBackendType> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select("*")
        .eq("id", freelancerId)
        .single();
    if (error) {
        console.error(error.message);
        throw new Error("Failed to fetch freelancer profile data!");
    }
    console.log(data);
    return data;
}

export async function updateFreelancerProfileImage({
    freelancerId,
    file,
}: {
    freelancerId: string;
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
        .from("freelancers")
        .update({ profile_pic: imageData.publicUrl })
        .eq("id", freelancerId);

    if (updateImageError) {
        throw new Error(updateImageError.message || "Error in uploading image");
    }

    return imageData.publicUrl;
}
