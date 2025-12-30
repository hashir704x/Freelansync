import { supabaseClient } from "@/supabase-client";
import type {
    ProjectFromBackendType,
    CreateProjectParamsType,
    ProjectDetailsByIdFromBackendType,
    AllProjectsForFreelancerFromBackendType,
    ProjectMessageFromBackendType,
} from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

export async function createProject(params: CreateProjectParamsType): Promise<string> {
    const { error: walletError, data: walletData } = await supabaseClient
        .from("clients")
        .select("wallet_amount")
        .eq("id", params.clientId)
        .single();
    if (walletError) {
        console.error(walletError.message);
        throw new Error(errorMessageMaker(walletError.message));
    }

    if (walletData.wallet_amount < params.budget) {
        throw new Error("You do not have enough funds for this project!");
    }

    const { data, error } = await supabaseClient
        .from("projects")
        .insert([
            {
                client: params.clientId,
                title: params.title,
                description: params.description,
                skills: params.skills,
                domains: params.domains,
                budget: params.budget,
                original_budget: params.budget,
            },
        ])
        .select("id, budget")
        .single();
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const newWalletAmount = walletData.wallet_amount - data.budget;

    const { error: updateError } = await supabaseClient
        .from("clients")
        .update({ wallet_amount: newWalletAmount })
        .eq("id", params.clientId)
        .select("wallet_amount")
        .single();
    if (updateError) {
        console.error(updateError.message);
        throw new Error(errorMessageMaker(updateError.message));
    }
    return data.id;
}

export async function getAllProjectsForClient(
    clientId: string
): Promise<ProjectFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("client", clientId)
        .order("created_at", { ascending: false });
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function getProjectDetailsById(
    projectId: string
): Promise<ProjectDetailsByIdFromBackendType> {
    const { data, error } = await supabaseClient
        .from("projects")
        .select(
            "*, client(id, username, email, profile_pic, role), project_and_freelancer_link(freelancer(id, username, description, email, profile_pic, role, skills, domains, created_at))"
        )
        .eq("id", projectId)
        .single();
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function getAllProjectsForFreelancer(
    freelancerId: string
): Promise<AllProjectsForFreelancerFromBackendType[]> {
    const { error, data } = await supabaseClient
        .from("project_and_freelancer_link")
        .select("project(*)")
        .eq("freelancer", freelancerId);
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data as unknown as AllProjectsForFreelancerFromBackendType[];
}

export async function recommendProjectsForInvitationForFreelancer({
    clientId,
    freelancerId,
}: {
    clientId: string;
    freelancerId: string;
}): Promise<
    {
        id: string;
        title: string;
        domains: string[];
        budget: number;
        original_budget: number;
    }[]
> {
    const { data: links, error: linkError } = await supabaseClient
        .from("project_and_freelancer_link")
        .select("project")
        .eq("freelancer", freelancerId)
        .eq("client", clientId);

    if (linkError) {
        console.error(linkError);
        throw new Error();
    }

    const linkedProjectIds = links.map((l) => l.project);

    if (linkedProjectIds.length > 0) {
        const { data, error } = await supabaseClient
            .from("projects")
            .select("id, title, domains, budget, original_budget")
            .eq("client", clientId)
            .not("id", "in", `(${linkedProjectIds.join(",")})`);

        if (error) {
            console.error(error);
            throw new Error();
        }

        return data;
    } else {
        const { data, error } = await supabaseClient
            .from("projects")
            .select("id, title, domains, budget, original_budget")
            .eq("client", clientId);

        if (error) {
            console.error(error);
            throw new Error();
        }
        return data;
    }
}

export async function getMessagesForProject({
    projectId,
}: {
    projectId: string;
}): Promise<ProjectMessageFromBackendType[]> {
    const { error, data } = await supabaseClient
        .from("project_messages")
        .select("*")
        .eq("project", projectId)
        .order("created_at", { ascending: true });
    if (error) {
        console.error(error.message);
        throw new Error();
    }
    return data;
}

export async function sendProjectChatMessage(params: {
    projectId: string;
    userId: string;
    senderUsername: string;
    messageText: string;
}): Promise<void> {
    const { error } = await supabaseClient.from("project_messages").insert([
        {
            project: params.projectId,
            sender: params.userId,
            sender_username: params.senderUsername,
            message_text: params.messageText,
        },
    ]);
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function uploadGroupChatMedia({
    file,
    senderId,
    senderUsername,
    projectId,
}: {
    file: File;
    senderId: string;
    senderUsername: string;
    projectId: string;
}): Promise<void> {
    const fileName = `${Date.now()}_${senderId}_${file.name}`;
    const { error } = await supabaseClient.storage
        .from("freelansync-media")
        .upload(`chat-media/${fileName}`, file, {
            upsert: false,
            cacheControl: "3600",
            contentType: file.type,
        });
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }

    const { data: fileData } = supabaseClient.storage
        .from("freelansync-media")
        .getPublicUrl(`chat-media/${fileName}`);
    if (!fileData.publicUrl) {
        console.error("Error! Failed to get file public url");
        throw new Error(
            errorMessageMaker("Failed to upload file, Failed to get public url")
        );
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "file";

    const { error: messageError } = await supabaseClient.from("project_messages").insert([
        {
            project: projectId,
            sender: senderId,
            sender_username: senderUsername,
            message_text: fileData.publicUrl,
            file_type: ext,
        },
    ]);
    if (messageError) {
        console.error(messageError.message);
        throw new Error(errorMessageMaker(messageError.message));
    }
}

export async function markProjectAsCompleted(params: {
    projectId: string;
}): Promise<boolean> {
    const { data, error } = await supabaseClient
        .from("milestones")
        .select("status")
        .eq("project", params.projectId);
    if (error) {
        console.error(error.message);
        throw new Error(error.message);
    }

    const anyNonCompleted = data.some((item) => item.status !== "COMPLETED");
    if (anyNonCompleted) {
        return false;
    }

    const { error: updateError } = await supabaseClient
        .from("projects")
        .update({ status: "COMPLETED" })
        .eq("id", params.projectId);
    if (updateError) {
        console.error(updateError.message);
        throw new Error(errorMessageMaker(updateError.message));
    }
    return true;
}
