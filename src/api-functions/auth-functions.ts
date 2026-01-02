import { supabaseClient } from "@/supabase-client";
import type { SignupParamsType, SignupResponseType, LoginResponseType } from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

export async function signup(params: SignupParamsType): Promise<SignupResponseType> {
    const authResponse = await supabaseClient.auth.signUp({
        email: params.email,
        password: params.password,
    });
    if (authResponse.error) {
        console.error(authResponse.error.message);
        throw new Error(errorMessageMaker(authResponse.error.message));
    }

    const userId = authResponse.data.user?.id;
    if (!userId) {
        console.error("User id not found");
        throw new Error(errorMessageMaker("Something went wrong, User id not found"));
    }

    const rolesTableResponse = await supabaseClient
        .from("user_roles")
        .insert([{ id: userId, role: params.role }]);
    if (rolesTableResponse.error) {
        console.error(rolesTableResponse.error.message);
        throw new Error(errorMessageMaker(rolesTableResponse.error.message));
    }

    if (params.role === "client") {
        const clientResponse = await supabaseClient
            .from("clients")
            .insert([{ id: userId, username: params.username, email: params.email }])
            .select("id, email, username, role, profile_pic")
            .single();
        if (clientResponse.error) {
            console.error(clientResponse.error.message);
            throw new Error(errorMessageMaker(clientResponse.error.message));
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
                    experience: params.experience,
                },
            ])
            .select("id, email, username, role, profile_pic, wallet_amount")
            .single();
        if (freelancerResponse.error) {
            console.error(freelancerResponse.error.message);
            throw new Error(errorMessageMaker(freelancerResponse.error.message));
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
        console.error(authResponse.error.message);
        throw new Error(errorMessageMaker(authResponse.error.message));
    }

    const rolesTableResponse = await supabaseClient
        .from("user_roles")
        .select("id, role")
        .single();
    if (rolesTableResponse.error) {
        console.error(rolesTableResponse.error.message);
        throw new Error(errorMessageMaker(rolesTableResponse.error.message));
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
        console.error(targetRoleTableResponse.error.message);
        throw new Error(errorMessageMaker(targetRoleTableResponse.error.message));
    }

    return targetRoleTableResponse.data;
}
