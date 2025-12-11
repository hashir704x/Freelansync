import { supabaseClient } from "@/supabase-client";
import type { FreelancerProfileOwnDataFromBackendType } from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

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
        throw new Error();
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
        console.error(uploadError.message);
        throw new Error(errorMessageMaker(uploadError.message));
    }

    const { data: imageData } = supabaseClient.storage
        .from("freelansync-media")
        .getPublicUrl(`profile-pics/${fileName}`);
    if (!imageData.publicUrl) {
        console.error("Error! Failed to get image public url");
        throw new Error(
            errorMessageMaker("Failed to upload image, Failed to get public url")
        );
    }

    const { error: updateImageError } = await supabaseClient
        .from("freelancers")
        .update({ profile_pic: imageData.publicUrl })
        .eq("id", freelancerId);

    if (updateImageError) {
        console.error(updateImageError.message);
        throw new Error(errorMessageMaker(updateImageError.message));
    }

    return imageData.publicUrl;
}
