import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { FreelancerFromBackendType } from "@/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMilestone } from "@/api-functions/milestone-functions";
import { Spinner } from "./ui/spinner";

type PropsType = {
    freelancersData: {
        freelancer: FreelancerFromBackendType;
    }[];
    clientId: string;
    clientUsername: string;
    projectId: string;
    projectTitle: string;
    projectBudget: number;
};

const CreateMilestoneDialog = (props: PropsType) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [freelancerId, setFreelancerId] = useState("");
    const [open, setOpen] = useState(false);

    const { isPending, mutate } = useMutation({
        mutationFn: createMilestone,
        onSuccess() {
            toast.success("Milestone created successfully");
            setAmount(0);
            setDescription("");
            setFreelancerId("");
            setTitle("");

            queryClient.invalidateQueries({
                queryKey: ["get-project-details", props.projectId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-milestones-for-project", props.projectId],
            });
            setOpen(false);
        },
        onError(error) {
            toast.error(`Failed to created milestone: ${error.message}`);
        },
    });

    function handleCreateMilestone(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!title || !description || !freelancerId) {
            toast.error("Milestone fields are empty");
            return;
        }

        if (amount === 0) {
            toast.error("Milestone amount cannot be 0");
            return;
        }

        if (amount > props.projectBudget) {
            toast.error("Project budget is not enough for this milestone!");
            return;
        }

        mutate({
            title: title,
            amount: amount,
            clientId: props.clientId,
            description: description,
            freelancerId: freelancerId,
            projectId: props.projectId,
            clientUsername: props.clientUsername,
            projectTitle: props.projectTitle,
            projectBudget: props.projectBudget,
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="custom" className="w-fit">
                    Create Milestone
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Create milestone for your project.
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter milestone details like title, description, amount,
                        freelancer etc to create milestone for your project.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleCreateMilestone} className="space-y-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="title" className="font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Add to Card API"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 py-1 px-2 rounded-md  outline-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="description"
                            className="font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            placeholder="Describe your milestone..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 outline-none resize-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <div className="flex-1">
                        <p className="mb-1 text-sm">Pick Freelancer</p>
                        <Select
                            value={freelancerId}
                            onValueChange={(value) => setFreelancerId(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pick Freelancer from project" />
                            </SelectTrigger>
                            <SelectContent>
                                {props.freelancersData.map((item) => (
                                    <SelectItem
                                        key={item.freelancer.id}
                                        value={item.freelancer.id}
                                    >
                                        <span> {item.freelancer.username}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="budget" className="font-medium text-gray-700">
                            Amount (within range of project budget)
                        </label>
                        <input
                            id="budget"
                            type="number"
                            min={0}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            disabled={isPending}
                            variant="custom"
                            type="submit"
                            className="bg-(--my-blue) hover:bg-(--my-blue-light) cursor-pointer"
                        >
                            {isPending && <Spinner />} Create
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CreateMilestoneDialog;
