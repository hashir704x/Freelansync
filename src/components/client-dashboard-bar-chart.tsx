"use client";

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
import type { ProjectFromBackendType } from "@/Types";

export const description = "Projects budget distribution";

const chartConfig = {
    projects: {
        label: "Projects",
        color: "var(--my-blue)",
    },
} satisfies ChartConfig;

type Props = {
    projectsData: ProjectFromBackendType[];
};

// Map projects to new budget ranges
function mapProjectsToBudgetRanges(projects: ProjectFromBackendType[]) {
    const bins: Record<string, number> = {
        "0-5k": 0,
        "5k-20k": 0,
        "20k-50k": 0,
        "50k-100k": 0,
        "100k+": 0,
    };

    projects.forEach((p) => {
        const budget = p.budget;
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

export default function ClientDashboardBarChart({ projectsData }: Props) {
    const chartData = mapProjectsToBudgetRanges(projectsData);
    const totalProjects = chartData.reduce((acc, item) => acc + item.projects, 0);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Projects Budget Distribution</CardTitle>
                <CardDescription>
                    Distribution of client projects across budget ranges
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    // className="mx-auto aspect-square w-[290px] sm:w-[450px] h-[250px]"
                >
                    <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="range"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="projects"
                            fill="var(--my-blue)"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Total projects: {totalProjects} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing how projects are distributed by budget ranges
                </div>
            </CardFooter>
        </Card>
    );
}
