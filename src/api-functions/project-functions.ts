import { supabaseClient } from "@/supabase-client";
import type { CreateProjectParamsType } from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

export async function createProject(params: CreateProjectParamsType) {
    const { data, error } = await supabaseClient
        .from("projects")
        .insert([
            {
                client: params.client,
                title: params.title,
                description: params.description,
                skills: params.skills,
                domains: params.domains,
                budget: params.budget,
            },
        ])
        .select("id")
        .single();
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
    }
}
