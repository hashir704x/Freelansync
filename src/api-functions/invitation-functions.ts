import { supabaseClient } from "@/supabase-client";
import { errorMessageMaker } from "./error-message-maker";

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
