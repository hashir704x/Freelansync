export type UserType = {
    id: string;
    username: string;
    email: string;
    role: "client" | "freelancer";
    profile_pic: string;
};

export type UserStoreType = {
    user: UserType | null;
    setUser: (user: UserType) => void;
    userExists: boolean;
    resetUser: () => void;
};

export type SignupParamsType = {
    username: string;
    email: string;
    password: string;
    description?: string;
    skills?: string[];
    domains?: string[];
    role: "freelancer" | "client";
};

export type SignupResponseType = {
    id: string;
    username: string;
    email: string;
    role: "freelancer" | "client";
    profile_pic: string;
};

export type LoginResponseType = {
    id: string;
    username: string;
    email: string;
    role: "freelancer" | "client";
    profile_pic: string;
};

export type ClientProfileOwnDataFromBackendType = {
    id: string;
    username: string;
    email: string;
    role: string;
    profile_pic: string;
    wallet_amount: number;
    created_at: string;
};

export type FreelancerProfileOwnDataFromBackendType = {
    id: string;
    username: string;
    description: string;
    skills: string[];
    profile_pic: string;
    role: string;
    wallet_amount: number;
    created_at: string;
    email: string;
    domains: string[];
};

export type CreateProjectParamsType = {
    title: string;
    description: string;
    budget: number;
    skills: string[];
    domains: string[];
    clientId: string;
};

export type ProjectFromBackendType = {
    id: string;
    title: string;
    description: string;
    budget: number;
    skills: string[];
    domains: string[];
    clientId: string;
    status: "DRAFT";
    created_at: string;
};

export type ProjectDetailsByIdFromBackendType = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    domains: string[];
    skills: string[];
    status: "DRAFT";
    budget: number;
    client: string;

    clients: {
        id: string;
        username: string;
        email: string;
        profile_pic: string;
        role: string;
    };
};

export type FreelancerDataFromBackendType = {
    id: string;
    username: string;
    description: string;
    profile_pic: string;
    role: string;
    email: string;
    domains: string[];
    skills: string[];
};
