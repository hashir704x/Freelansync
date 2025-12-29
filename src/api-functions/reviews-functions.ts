import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type { FreelancerReviewFromBackendType } from "@/Types";

export async function createReview(params: {
    freelancerId: string;
    clientId: string;
    stars: number;
    comment: string;
}): Promise<string | undefined> {
    const { count, error: countError } = await supabaseClient
        .from("freelancer_reviews")
        .select("*", { count: "exact", head: true })
        .eq("client", params.clientId)
        .eq("freelancer", params.freelancerId);
    if (countError) {
        console.error(countError.message);
        throw new Error(errorMessageMaker(countError.message));
    }

    if (count && count >= 3) {
        return "Max limit of review reached. You can only review a freelancer max 3 times";
    }

    console.log(count);

    const { error } = await supabaseClient.from("freelancer_reviews").insert([
        {
            client: params.clientId,
            freelancer: params.freelancerId,
            comment: params.comment,
            stars: params.stars,
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
