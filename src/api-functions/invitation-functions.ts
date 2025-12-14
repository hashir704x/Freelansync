import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";
import type { InvitationsDataFromBackendType } from "@/Types";

export async function createInvitation(params: {
    clientId: string;
    freelancerId: string;
    projectId: string;
}) {
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
): Promise<InvitationsDataFromBackendType[]> {
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
