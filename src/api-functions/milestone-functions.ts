import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type {
    MilestoneDetailesFromBackendType,
    MilestonesFromBackendType,
} from "@/Types";

export async function createMilestone({
    title,
    amount,
    clientId,
    description,
    freelancerId,
    projectId,
    clientUsername,
    projectTitle,
    projectBudget,
}: {
    projectId: string;
    clientId: string;
    freelancerId: string;
    title: string;
    description: string;
    amount: number;
    clientUsername: string;
    projectTitle: string;
    projectBudget: number;
}): Promise<void> {
    const { error, data } = await supabaseClient
        .from("milestones")
        .insert([
            {
                title: title,
                description: description,
                amount: amount,
                project: projectId,
                client: clientId,
                freelancer: freelancerId,
                status: "LOCKED",
            },
        ])
        .select("amount")
        .single();
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const updatedBudget = projectBudget - data.amount;
    const { error: updateError } = await supabaseClient
        .from("projects")
        .update({ budget: updatedBudget, status: "ACTIVE" })
        .eq("id", projectId);

    if (updateError) {
        console.error(updateError.message);
        throw new Error(updateError.message);
    }

    const { error: notificationError } = await supabaseClient
        .from("notifications")
        .insert([
            {
                to_user_id: freelancerId,
                title: "Milestone Assigned",
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

export async function getMilestoneDetailsById(
    milestoneId: string
): Promise<MilestoneDetailesFromBackendType> {
    const { data, error } = await supabaseClient
        .from("milestones")
        .select(
            "*, freelancer(id, username, profile_pic, domains, email), client(id, username, email, profile_pic), project(id, title, description, original_budget, domains, status)"
        )
        .eq("id", milestoneId)
        .single();
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function updateMilestoneStatus({
    milestoneId,
    freelancerId,
    milestoneAmount,
    requiredChoice,
}: {
    milestoneId: string;
    milestoneAmount: number;
    freelancerId: string;
    requiredChoice: "IN_PROGRESS" | "COMPLETED";
}): Promise<void> {
    if (requiredChoice === "COMPLETED") {
        const { error, data } = await supabaseClient
            .from("freelancers")
            .select("wallet_amount")
            .eq("id", freelancerId)
            .single();
        if (error) {
            console.error(error.message);
            throw new Error(errorMessageMaker(error.message));
        }

        const updatedWalletAmount = data.wallet_amount + milestoneAmount;
        const { error: updateError } = await supabaseClient
            .from("freelancers")
            .update({ wallet_amount: updatedWalletAmount })
            .eq("id", freelancerId);
        if (updateError) {
            console.error(updateError.message);
            throw new Error(errorMessageMaker(updateError.message));
        }

        const { error: milestoneError } = await supabaseClient
            .from("milestones")
            .update({ status: "COMPLETED" })
            .eq("id", milestoneId);
        if (milestoneError) {
            console.error(milestoneError.message);
            throw new Error(errorMessageMaker(milestoneError.message));
        }
    } else {
        const { error: milestoneError } = await supabaseClient
            .from("milestones")
            .update({ status: "IN_PROGRESS" })
            .eq("id", milestoneId);
        if (milestoneError) {
            console.error(milestoneError.message);
            throw new Error(errorMessageMaker(milestoneError.message));
        }
    }
}

export async function submitMilestone({
    milestoneId,
    description,
    file,
    clientId,
    projectTitle,
    projectId,
    freelancerUsername,
}: {
    milestoneId: string;
    description: string;
    file: File | null;
    clientId: string;
    projectTitle: string;
    projectId: string;
    freelancerUsername: string;
}): Promise<void> {
    if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabaseClient.storage
            .from("freelansync-media")
            .upload(`milestones-media/${fileName}`, file, {
                upsert: false,
                cacheControl: "3600",
                contentType: file.type,
            });
        if (uploadError) {
            console.error(uploadError.message);
            throw new Error(errorMessageMaker(uploadError.message));
        }

        const { data: fileData } = supabaseClient.storage
            .from("freelansync-media")
            .getPublicUrl(`milestones-media/${fileName}`);
        if (!fileData.publicUrl) {
            console.error("Error! Failed to get file  public url");
            throw new Error(
                errorMessageMaker("Failed to upload file, Failed to get public url")
            );
        }

        const { error: updateError } = await supabaseClient
            .from("milestones")
            .update({
                submission_description: description,
                file: fileData.publicUrl,
                status: "SUBMITTED",
            })
            .eq("id", milestoneId);
        if (updateError) {
            console.error(updateError.message);
            throw new Error(errorMessageMaker(updateError.message));
        }
    } else {
        const { error: updateError } = await supabaseClient
            .from("milestones")
            .update({
                submission_description: description,
                status: "SUBMITTED",
            })
            .eq("id", milestoneId);
        if (updateError) {
            console.error(updateError.message);
            throw new Error(errorMessageMaker(updateError.message));
        }
    }

    const { error: notificationError } = await supabaseClient
        .from("notifications")
        .insert([
            {
                to_user_id: clientId,
                title: "Milestone Submitted",
                content: `Freelancer ${freelancerUsername} has submitted a milestone in your ${projectTitle} project.`,
                type: "Milestone_Submitted",
                project_id: projectId,
                milestone_id: milestoneId,
            },
        ]);
    if (notificationError) {
        console.error(notificationError);
        throw new Error(errorMessageMaker(notificationError.message));
    }
}

export async function deleteMilestoneSubmission(milestoneId: string) {
    const { error } = await supabaseClient
        .from("milestones")
        .update({
            status: "IN_PROGRESS",
            submission_description: null,
            file: null,
        })
        .eq("id", milestoneId);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function getRecentMilestonesForUser({
    userId,
    userRole,
}: {
    userId: string;
    userRole: "client" | "freelancer";
}): Promise<MilestonesFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("milestones")
        .select("*, freelancer(id, username, profile_pic)")
        .eq(userRole, userId)
        .order("created_at", { ascending: false })
        .limit(3);
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function deleteMilestone(params: {
    milestoneId: string;
    milestoneAmount: number;
    projectId: string;
}) {
    const { data, error: projectError } = await supabaseClient
        .from("projects")
        .select("budget")
        .eq("id", params.projectId)
        .single();
    if (projectError) {
        console.error(projectError.message);
        throw new Error(errorMessageMaker(projectError.message));
    }

    const newBudget = data.budget + params.milestoneAmount;
    const { error: projectUpdateError } = await supabaseClient
        .from("projects")
        .update({ budget: newBudget })
        .eq("id", params.projectId);
    if (projectUpdateError) {
        console.error(projectUpdateError.message);
        throw new Error(errorMessageMaker(projectUpdateError.message));
    }

    const { error } = await supabaseClient
        .from("milestones")
        .delete()
        .eq("id", params.milestoneId);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}
