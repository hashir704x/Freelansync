import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type { MilestonesFromBackendType } from "@/Types";

export async function createMilestone({
    title,
    amount,
    clientId,
    description,
    freelancerId,
    projectId,
}: {
    projectId: string;
    clientId: string;
    freelancerId: string;
    title: string;
    description: string;
    amount: number;
}): Promise<void> {
    const { error } = await supabaseClient.from("milestones").insert([
        {
            title: title,
            description: description,
            amount: amount,
            project: projectId,
            client: clientId,
            freelancer: freelancerId,
            status: "LOCKED",
        },
    ]);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function getAllMilestonesForProject(
    projectId: string
): Promise<MilestonesFromBackendType[]> {
    const { error, data } = await supabaseClient
        .from("milestones")
        .select("*, freelancer(id, username, profile_pic)")
        .eq("project", projectId);
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}
