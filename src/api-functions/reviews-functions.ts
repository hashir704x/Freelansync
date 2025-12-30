import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type { FreelancerReviewFromBackendType } from "@/Types";

export async function createReview(params: {
    freelancerId: string;
    clientId: string;
    stars: number;
    comment: string;
    projectId: string;
}): Promise<void> {
    const { error } = await supabaseClient.from("freelancer_reviews").insert([
        {
            client: params.clientId,
            freelancer: params.freelancerId,
            comment: params.comment,
            stars: params.stars,
            project: params.projectId,
        },
    ]);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function getAllReviewsForFreelancer(
    freelancerId: string
): Promise<FreelancerReviewFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("freelancer_reviews")
        .select("id, created_at, comment, stars, client(id, username, profile_pic)")
        .eq("freelancer", freelancerId)
        .order("created_at", { ascending: false });
    if (error) {
        console.error(error.message);
        throw new Error();
    }

    return data as unknown as FreelancerReviewFromBackendType[];
}

export async function checkReviewExistance(params: {
    freelancerId: string;
    clientId: string;
    projectId: string;
}): Promise<false | { id: string; comment: string; stars: number }> {
    const { data, error } = await supabaseClient
        .from("freelancer_reviews")
        .select("id, comment, stars")
        .eq("freelancer", params.freelancerId)
        .eq("client", params.clientId)
        .eq("project", params.projectId);
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    if (data.length === 0) return false;
    else return data[0];
}
