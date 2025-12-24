import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import type { AllProjectsForFreelancerFromBackendType } from "@/Types";

export const description = "Projects budget distribution";

const chartConfig = {
    projects: {
        label: "Projects",
        color: "var(--my-blue)",
    },
} satisfies ChartConfig;

type Props = {
    projectsData: AllProjectsForFreelancerFromBackendType[];
};

// Map projects to new budget ranges
function mapProjectsToBudgetRanges(projects: AllProjectsForFreelancerFromBackendType[]) {
    const bins: Record<string, number> = {
        "0-5k": 0,
        "5k-20k": 0,
        "20k-50k": 0,
        "50k-100k": 0,
        "100k+": 0,
    };

    projects.forEach((p) => {
        const budget = p.project.budget;
        if (budget <= 5000) bins["0-5k"]++;
        else if (budget <= 20000) bins["5k-20k"]++;
        else if (budget <= 50000) bins["20k-50k"]++;
        else if (budget <= 100000) bins["50k-100k"]++;
        else bins["100k+"]++;
    });

    return Object.entries(bins).map(([range, projects]) => ({
        range,
        projects,
    }));
}

export default function FreelancerDashboardBarChart({ projectsData }: Props) {
    const chartData = mapProjectsToBudgetRanges(projectsData);
    const totalProjects = chartData.reduce((acc, item) => acc + item.projects, 0);

    return (
        <Card className="w-full flex-[1.5]">
            <CardHeader>
                <CardTitle>Projects Budget Distribution</CardTitle>
                <CardDescription>
                    Distribution of client projects across budget ranges
                </CardDescription>
            </CardHeader>

            {projectsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-xl font-medium mt-12">No Projects Yet</h2>
                    <p className="text-center mt-2 text-gray-500 font-medium">
                        You haven't created any projects yet. Get started by creating your
                        first project.
                    </p>
                </div>
            ) : (
                <div>
                    <CardContent className="p-0">
                        <ChartContainer config={chartConfig}>
                            <BarChart data={chartData} margin={{ left: 6, right: 6 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="range"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey="projects"
                                    fill="var(--my-blue)"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 leading-none font-medium mt-6">
                            Total projects: {totalProjects}{" "}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground">
                            Showing how projects are distributed across different budget
                            ranges
                        </div>
                    </CardFooter>
                </div>
            )}
        </Card>
    );
}
