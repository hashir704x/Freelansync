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
import { useState } from "react";
import type { MilestoneStatusType } from "@/Types";
import { Spinner } from "./ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMilestoneStatus } from "@/api-functions/milestone-functions";
import { toast } from "sonner";

const StatusChoices: MilestoneStatusType[] = ["LOCKED", "IN_PROGRESS", "COMPLETED"];

const UpadateMilestoneStatusDialog = ({
    milestoneStatus,
    milestoneId,
}: {
    milestoneStatus: MilestoneStatusType;
    milestoneId: string;
}) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [selectedChoice, setSelectedChoice] =
        useState<MilestoneStatusType>(milestoneStatus);

    const { mutate, isPending } = useMutation({
        mutationFn: updateMilestoneStatus,
        onSuccess() {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-milestone-details-by-id", milestoneId],
            });
            setOpen(false);
        },
        onError(error) {
            toast.error(`Failed to update status: ${error.message}`);
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild className="mt-5">
                <Button variant="custom" className="w-fit">
                    Update Status
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Change the current status of your milestone.
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You can set status to lock, in progress or completed. Change will
                        affect the milestone working on freelancer end also.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex-1">
                    <p className="mb-1 text-sm">Update Options</p>
                    <Select
                        value={selectedChoice}
                        onValueChange={(value) =>
                            setSelectedChoice(value as MilestoneStatusType)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pick Freelancer from project" />
                        </SelectTrigger>
                        <SelectContent>
                            {StatusChoices.map((item) => (
                                <SelectItem key={item} value={item}>
                                    <span>{item}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() =>
                            mutate({ milestoneId: milestoneId, status: selectedChoice })
                        }
                        disabled={isPending}
                        variant="custom"
                        type="submit"
                        className="bg-(--my-blue) hover:bg-(--my-blue-light) cursor-pointer"
                    >
                        {isPending && <Spinner />} Update
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default UpadateMilestoneStatusDialog;
