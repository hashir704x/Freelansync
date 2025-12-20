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
    clientUsername,
    projectTitle,
}: {
    projectId: string;
    clientId: string;
    freelancerId: string;
    title: string;
    description: string;
    amount: number;
    clientUsername: string;
    projectTitle: string;
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

    const { error: notificationError } = await supabaseClient
        .from("notifications")
        .insert([
            {
                to_user_id: freelancerId,
                title: "New Invitation",
                content: `Client ${clientUsername} has assigned a milestone to you in their ${projectTitle} project.`,
                type: "Milestone_Assigned",
                project_id: projectId,
            },
        ]);
    if (notificationError) {
        console.error(notificationError);
        throw new Error(errorMessageMaker(notificationError.message));
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
