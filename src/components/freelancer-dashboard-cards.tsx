import { ArrowUp, Check, XCircle, Clock } from "lucide-react";
import type { AllProjectsForFreelancerFromBackendType } from "@/Types";

type Props = {
    projectsData: AllProjectsForFreelancerFromBackendType[];
};

export default function FreeLancerDashboardCards({ projectsData }: Props) {
    // Compute stats
    const totalProjects = projectsData.length;
    const activeProjects = projectsData.filter(
        (p) => p.project.status === "ACTIVE"
    ).length;
    const completedProjects = projectsData.filter(
        (p) => p.project.status === "COMPLETED"
    ).length;
    const disputedProjects = projectsData.filter(
        (p) => p.project.status === "DISPUTED"
    ).length;

    const cards = [
        {
            title: "Total Projects",
            value: totalProjects,
            icon: <Clock className="w-6 h-6 text-gray-700" />,
            description: "All projects",
            textColor: "text-gray-800",
        },
        {
            title: "Active Projects",
            value: activeProjects,
            icon: <ArrowUp className="w-6 h-6 text-blue-600" />,
            description: "Currently in progress",
            textColor: "text-blue-800",
        },
        {
            title: "Completed",
            value: completedProjects,
            icon: <Check className="w-6 h-6 text-green-600" />,
            description: "Successfully finished",
            textColor: "text-green-800",
        },
        {
            title: "Disputed",
            value: disputedProjects,
            icon: <XCircle className="w-6 h-6 text-red-600" />,
            description: "Projects under dispute",
            textColor: "text-red-800",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className={`flex flex-col justify-between p-6 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`text-2xl font-bold ${card.textColor}`}>
                                {card.value}
                            </span>
                            <span className="text-sm font-medium text-gray-600 mt-1">
                                {card.description}
                            </span>
                        </div>
                        <div>{card.icon}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
