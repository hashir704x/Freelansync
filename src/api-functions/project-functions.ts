import { supabaseClient } from "@/supabase-client";
import type {
    ProjectFromBackendType,
    CreateProjectParamsType,
    ProjectDetailsByIdFromBackendType,
} from "@/Types";
import { errorMessageMaker } from "./error-message-maker";

export async function createProject(params: CreateProjectParamsType): Promise<string> {
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
            },
        ])
        .select("id")
        .single();
    if (error) {
        console.error(error.message);
        throw new Error(errorMessageMaker(error.message));
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
        .select("*, clients(id, username, email, profile_pic, role)")
        .eq("id", projectId)
        .single();
    if (error) {
        console.error(error.message);
        throw new Error();
    }

    return data;
}
