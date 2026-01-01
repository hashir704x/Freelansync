import { supabaseClient } from "@/supabase-client";
import type {
    FreelancerFromBackendType,
    FreelancerProfileOwnFromBackendType,
} from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

export async function getFreelancerProfileOwnDataById(
    freelancerId: string
): Promise<FreelancerProfileOwnFromBackendType> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select("*")
        .eq("id", freelancerId)
        .single();
    if (error) {
        console.error(error.message);
        throw new Error();
    }
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

export async function getAllFreelancers(): Promise<FreelancerFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select(
            "id, username, description, email, profile_pic, role, skills, domains, created_at"
        );

    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function getFreelancersToRecommend(
    projectId: string
): Promise<FreelancerFromBackendType[]> {
    const { data: allFreelancers, error } = await supabaseClient
        .from("freelancers")
        .select(
            "id, username, description, email, profile_pic, role, skills, domains, created_at"
        );
    if (error) throw new Error(error.message);

    const { data: memberFreelancers, error: freelancerError } = await supabaseClient
        .from("project_and_freelancer_link")
        .select("freelancer")
        .eq("project", projectId);

    if (freelancerError) throw new Error(freelancerError.message);

    const memberFreelancersIds = memberFreelancers.map((f) => f.freelancer);
    const recommendedFreelancers = allFreelancers.filter(
        (freelancer) => !memberFreelancersIds.includes(freelancer.id)
    );

    return recommendedFreelancers;
}

export async function getFreelancerDetailsForClient(
    freelancerId: string
): Promise<FreelancerFromBackendType> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select(
            "id, username, description, email, profile_pic, role, skills, domains, created_at"
        )
        .eq("id", freelancerId)
        .single();

    if (error) {
        console.error(error.message);
        throw new Error();
    }

    return data;
}

export async function getFreelancerDetails(
    freelancerId: string
): Promise<FreelancerFromBackendType> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select(
            "id, username, description, email, profile_pic, role, skills, domains, created_at"
        )
        .eq("id", freelancerId)
        .single();

    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function getAiMatchMakingFreelancersResults(params: {
    skills: string[];
    count: number;
}) {
    try {
        const response = await fetch(
            "https://freelancerrecommendation-production.up.railway.app/recommend",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ skills: params.skills, top_n: params.count }),
            }
        );
        const apiData = await response.json();
        const idsOnly = apiData.recommendations.map((item: { id: string }) => item.id);
        const { data: freelancersData, error: freelancerError } = await supabaseClient
            .from("freelancers")
            .select(
                "id, username, description, email, profile_pic, role, skills, domains, created_at"
            )
            .in("id", idsOnly);

        if (freelancerError) throw new Error(freelancerError.message);

        return freelancersData;
    } catch (error) {
        console.error(error);
        throw new Error();
    }
}
