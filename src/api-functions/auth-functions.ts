import { supabaseClient } from "@/supabase-client";
import type { SignupParamsType, SignupResponseType, LoginResponseType } from "@/Types";

export async function signup(params: SignupParamsType): Promise<SignupResponseType> {
    const authResponse = await supabaseClient.auth.signUp({
        email: params.email,
        password: params.password,
    });
    if (authResponse.error) {
        throw new Error(authResponse.error.message || "Error in auth process");
    }

    const userId = authResponse.data.user?.id;
    if (!userId) {
        throw new Error("Error in auth process, cannot get user id");
    }

    const rolesTableResponse = await supabaseClient
        .from("user_roles")
        .insert([{ id: userId, role: params.role }]);
    if (rolesTableResponse.error) {
        throw new Error(
            rolesTableResponse.error.message || "Error in roles table response"
        );
    }

    if (params.role === "client") {
        const clientResponse = await supabaseClient
            .from("clients")
            .insert([{ id: userId, username: params.username, email: params.email }])
            .select("id, email, username, role, profile_pic")
            .single();
        if (clientResponse.error) {
            throw new Error(clientResponse.error.message || "Error in client response");
        }

        return clientResponse.data;
    } else {
        const freelancerResponse = await supabaseClient
            .from("freelancers")
            .insert([
                {
                    id: userId,
                    username: params.username,
                    email: params.email,
                    description: params.description,
                    domains: params.domains,
                    skills: params.skills,
                },
            ])
            .select("id, email, username, role, profile_pic")
            .single();
        if (freelancerResponse.error) {
            throw new Error(
                freelancerResponse.error.message || "Error in client response"
            );
        }

        return freelancerResponse.data;
    }
}

export async function login(params: {
    email: string;
    password: string;
}): Promise<LoginResponseType> {
    const authResponse = await supabaseClient.auth.signInWithPassword({
        email: params.email,
        password: params.password,
    });
    if (authResponse.error) {
        throw new Error(authResponse.error.message || "Error in auth process");
    }

    const rolesTableResponse = await supabaseClient
        .from("user_roles")
        .select("id, role")
        .single();
    if (rolesTableResponse.error) {
        throw new Error(
            rolesTableResponse.error.message || "Error in roles table response"
        );
    }

    const userId = rolesTableResponse.data.id;
    let targetTable: "clients" | "freelancers" = "clients";
    if (rolesTableResponse.data.role === "freelancer") targetTable = "freelancers";

    const targetRoleTableResponse = await supabaseClient
        .from(targetTable)
        .select("id, email, username, role, profile_pic")
        .eq("id", userId)
        .single();

    if (targetRoleTableResponse.error) {
        throw new Error(
            targetRoleTableResponse.error.message || "Error in target table response"
        );
    }

    return targetRoleTableResponse.data;
}
