import * as React from "react";
import { Pie, PieChart, Label } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
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

const chartConfig = {
    projects: {
        label: "Projects",
    },
    DRAFT: {
        label: "Draft",
        color: "var(--chart-1)",
    },
    ACTIVE: {
        label: "Active",
        color: "var(--my-blue)",
    },
    COMPLETED: {
        label: "Completed",
        color: "var(--chart-3)",
    },
    DISPUTED: {
        label: "Disputed",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig;

type Props = {
    projectsData: ProjectFromBackendType[];
};

export default function ClientDashboardPieChart({ projectsData }: Props) {
    // Map backend data to chart-friendly format
    const chartData = React.useMemo(() => {
        const counts = {
            DRAFT: 0,
            ACTIVE: 0,
            COMPLETED: 0,
            DISPUTED: 0,
        };

        projectsData.forEach((project) => {
            counts[project.status]++;
        });

        return [
            { status: "DRAFT", projects: counts.DRAFT, fill: "var(--chart-1)" },
            { status: "ACTIVE", projects: counts.ACTIVE, fill: "var(--my-blue)" },
            { status: "COMPLETED", projects: counts.COMPLETED, fill: "var(--chart-3)" },
            { status: "DISPUTED", projects: counts.DISPUTED, fill: "var(--chart-4)" },
        ];
    }, [projectsData]);

    const totalProjects = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.projects, 0),
        [chartData]
    );

    return (
        <Card className="flex flex-col w-full ">
            <CardHeader className="items-center pb-0">
                <CardTitle>Project Status Overview</CardTitle>
                <CardDescription>
                    A quick Overview of client projects, shows active, completed, disputed
                    and draft projects
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0 flex flex-col items-center">
                <ChartContainer
                    config={chartConfig}
                    className="w-full aspect-square h-[260px]"
                    // className="mx-auto aspect-square w-[280px] sm:w-[480px] h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Pie
                            data={chartData}
                            dataKey="projects"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalProjects}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Total Projects
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* Status Legend with counts */}
                <div className="mt-4 w-full max-w-xs grid grid-cols-2 gap-2">
                    {chartData.map((item) => (
                        <div
                            key={item.status}
                            className="flex items-center justify-between rounded-md border px-2 py-1"
                        >
                            <div className="flex items-center gap-1">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <span className="text-sm font-medium capitalize">
                                    {item.status}
                                </span>
                            </div>
                            <span className="text-sm font-bold">{item.projects}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
