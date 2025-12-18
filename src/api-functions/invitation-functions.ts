import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type {
    InvitationsForFreelancerFromBackendType,
    InvitationsForProjectFromBackendType,
} from "@/Types";

export async function createInvitation(params: {
    clientId: string;
    freelancerId: string;
    projectId: string;
}): Promise<void> {
    const { error } = await supabaseClient.from("invitations").insert([
        {
            client: params.clientId,
            freelancer: params.freelancerId,
            project: params.projectId,
        },
    ]);
    if (error) {
        console.error(error);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function getAllInvitationsForProject(
    projectId: string
): Promise<InvitationsForProjectFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("invitations")
        .select("*, freelancer(id, profile_pic, username, email, domains, role)")
        .eq("project", projectId)
        .order("created_at", { ascending: false });
    if (error) {
        console.error(error);
        throw new Error();
    }
    return data;
}

export async function deleteInvitation(invitationId: string): Promise<void> {
    const { error } = await supabaseClient
        .from("invitations")
        .delete()
        .eq("id", invitationId);
    if (error) {
        console.error(error);
        throw new Error(errorMessageMaker(error.message));
    }
}

export async function getAllInvitationsForFreelancer(): Promise<
    InvitationsForFreelancerFromBackendType[]
> {
    const { data, error } = await supabaseClient
        .from("invitations")
        .select(
            "*, client(id, email, username, profile_pic, role), project(id, title, description, domains, skills, budget, created_at)"
        )
        .order("created_at", { ascending: false });
    if (error) {
        console.error(error);
        throw new Error();
    }
    return data;
}

export async function acceptInviteAndAddFreelancerToProject({
    invitationId,
    clientId,
    freelancerId,
    projectId,
    freelancerUsername,
    projectTitle,
}: {
    invitationId: string;
    clientId: string;
    freelancerId: string;
    projectId: string;
    freelancerUsername: string;
    projectTitle: string;
}): Promise<void> {
    const { error } = await supabaseClient
        .from("project_and_freelancer_link")
        .insert([{ client: clientId, project: projectId, freelancer: freelancerId }]);
    if (error) {
        console.error(error);
        throw new Error(errorMessageMaker(error.message));
    }

    const { error: secondError } = await supabaseClient
        .from("invitations")
        .delete()
        .eq("id", invitationId);
    if (secondError) {
        console.error(secondError);
        throw new Error(errorMessageMaker(secondError.message));
    }

    const { error: invitationError } = await supabaseClient.from("notifications").insert([
        {
            to_user_id: clientId,
            title: "Invitation Accepted",
            content: `Freelancer ${freelancerUsername} has accepted your invitation for ${projectTitle} project`,
            type: "Invitation",
        },
    ]);
    if (invitationError) {
        console.error(invitationError);
        throw new Error(errorMessageMaker(invitationError.message));
    }
}
