import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";

export async function createDispute(params: {
    projectId: string;
    milestoneId: string;
    clientId: string;
    freelancerId: string;
    disputeDescription: string;
    freelancerUsername: string;
    projectTitle: string;
}): Promise<void> {
    const { error } = await supabaseClient.from("disputes").insert([
        {
            project: params.projectId,
            milestone: params.milestoneId,
            freelancer: params.freelancerId,
            client: params.clientId,
            dispute_description: params.disputeDescription,
        },
    ]);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const { error: projectError } = await supabaseClient
        .from("projects")
        .update({ status: "DISPUTED" })
        .eq("id", params.projectId);
    if (projectError) {
        console.error(projectError.message);
        throw new Error(errorMessageMaker(projectError.message));
    }

    const { error: milestoneError } = await supabaseClient
        .from("milestones")
        .update({ status: "DISPUTED" })
        .eq("id", params.milestoneId);
    if (milestoneError) {
        console.error(milestoneError.message);
        throw new Error(errorMessageMaker(milestoneError.message));
    }

    const { error: notificationError } = await supabaseClient
        .from("notifications")
        .insert([
            {
                to_user_id: params.clientId,
                title: "Dispute Raised",
                content: `Freelancer ${params.freelancerUsername} has raised a dispute in your ${params.projectTitle} project.`,
                type: "Dispute_Raised",
                project_id: params.projectId,
            },
        ]);
    if (notificationError) {
        console.error(notificationError.message);
        throw new Error(errorMessageMaker(notificationError.message));
    }
}

export async function deleteDispute(params: {
    milestoneId: string;
    projectId: string;
}): Promise<void> {
    const { error } = await supabaseClient
        .from("disputes")
        .delete()
        .eq("project", params.projectId)
        .eq("milestone", params.milestoneId);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const { error: milestoneError } = await supabaseClient
        .from("milestones")
        .update({ status: "SUBMITTED" })
        .eq("id", params.milestoneId);
    if (milestoneError) {
        console.error(milestoneError.message);
        throw new Error(errorMessageMaker(milestoneError.message));
    }

    const { count, error: disputeReadError } = await supabaseClient
        .from("disputes")
        .select("*", { count: "exact", head: true })
        .eq("project", params.projectId);
    if (disputeReadError) {
        console.error(disputeReadError.message);
        throw new Error(errorMessageMaker(disputeReadError.message));
    }

    if (count === 0) {
        const { error: projectError } = await supabaseClient
            .from("projects")
            .update({ status: "ACTIVE" })
            .eq("id", params.projectId);
        if (projectError) {
            console.error(projectError.message);
            throw new Error(errorMessageMaker(projectError.message));
        }
    }
}
