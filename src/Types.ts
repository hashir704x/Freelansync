export type UserType = {
    id: string;
    username: string;
    email: string;
    role: "client" | "freelancer";
    profile_pic: string;
    wallet_amount: number;
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
    wallet_amount: number;
};

export type LoginResponseType = {
    id: string;
    username: string;
    email: string;
    role: "freelancer" | "client";
    profile_pic: string;
    wallet_amount: number;
};

export type ClientProfileOwnFromBackendType = {
    id: string;
    username: string;
    email: string;
    role: string;
    profile_pic: string;
    wallet_amount: number;
    created_at: string;
};

export type FreelancerProfileOwnFromBackendType = {
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
    status: "DRAFT" | "COMPLETED" | "DISPUTED" | "ACTIVE";
    created_at: string;
};

export type ProjectDetailsByIdFromBackendType = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    domains: string[];
    skills: string[];
    status: "DRAFT" | "COMPLETED" | "DISPUTED" | "ACTIVE";
    budget: number;

    client: {
        id: string;
        username: string;
        email: string;
        profile_pic: string;
        role: string;
    };

    project_and_freelancer_link: {
        freelancer: {
            id: string;
            username: string;
            description: string;
            profile_pic: string;
            role: string;
            email: string;
            domains: string[];
            skills: string[];
            created_at: string;
        };
    }[];
};

export type FreelancerFromBackendType = {
    id: string;
    username: string;
    description: string;
    profile_pic: string;
    role: string;
    email: string;
    domains: string[];
    skills: string[];
    created_at: string;
};

export type ClientDetailsForFreelancerFromBackendType = {
    id: string;
    username: string;
    email: string;
    role: string;
    profile_pic: string;
    created_at: string;
};

export type InvitationsForProjectFromBackendType = {
    id: string;
    created_at: string;
    project: string;
    freelancer: {
        id: string;
        username: string;
        profile_pic: string;
        role: string;
        email: string;
        domains: string[];
    };
};

export type InvitationsForFreelancerFromBackendType = {
    id: string;
    created_at: string;
    client: {
        id: string;
        username: string;
        email: string;
        profile_pic: string;
        role: string;
    };
    project: {
        id: string;
        title: string;
        description: string;
        created_at: string;
        domains: string[];
        skills: string[];
        budget: number;
    };
};

export type AllProjectsForFreelancerFromBackendType = {
    project: ProjectFromBackendType;
};

export type NotificationsFromBackendType = {
    id: number;
    read: boolean;
    title: string;
    content: string;
    to_user_id: string;
    created_at: string;
    project_id?: string;
    milestone_id?: string;
    type:
        | "Invitation_Accepted"
        | "Invitation_Rejected"
        | "Invitation_Recieved"
        | "Milestone_Assigned"
        | "Milestone_Submitted";
};

export type MilestoneStatusType = "LOCKED" | "IN_PROGRESS" | "COMPLETED" | "SUBMITTED";

export type MilestonesFromBackendType = {
    id: string;
    title: string;
    description: string;
    amount: number;
    project: string;
    client: string;
    created_at: string;
    file: string | null;
    freelancer: {
        id: string;
        profile_pic: string;
        username: string;
    };
    status: MilestoneStatusType;
};

export type MilestoneDetailesFromBackendType = {
    id: string;
    title: string;
    description: string;
    amount: number;
    client: {
        id: string;
        username: string;
        profile_pic: string;
        email: string;
    };
    created_at: string;
    file: string | null;
    submission_description: string;
    freelancer: {
        id: string;
        profile_pic: string;
        username: string;
        domains: string[];
        email: string;
    };
    project: {
        id: string;
        title: string;
        description: string;
        budget: string;
        domains: string[];
        status: "DRAFT";
    };
    status: MilestoneStatusType;
};

export type ChatFromBackendType = {
    id: string;
    created_at: string;
    freelancer?: {
        id: string;
        username: string;
        profile_pic: string;
    };
    client?: {
        id: string;
        username: string;
        profile_pic: string;
    };
};

export type MessageFromBackendType = {
    chat_id: string;
    created_at: string;
    file_type: string | null;
    id: number;
    message_text: string;
    sender_id: string;
    sender_role: "client" | "freelancer";
};
