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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "@/api-functions/project-functions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type PropsType = {
    clientId: string;
    projectAmount: number;
    projectId: string;
};

const ClientDeleteProjectDialog = (props: PropsType) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteProject,
        onSuccess() {
            toast.success("Project deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-all-projects-for-client"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-client-wallet-funds"],
            });
            navigate("/client/")
            setOpen(false);
        },
        onError(error) {
            toast.error(`Failed to delete project: ${error.message}`);
        },
    });
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-fit cursor-pointer">
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4 sm:p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Do you really want to delete this project?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This change will be permanent and funds allocated to project will
                        be moved back to you wallet.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={() =>
                            mutate({
                                clientId: props.clientId,
                                projectAmount: props.projectAmount,
                                projectId: props.projectId,
                            })
                        }
                        disabled={isPending}
                        variant="destructive"
                        type="submit"
                        className="cursor-pointer"
                    >
                        {isPending && <Spinner />} Confirm
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientDeleteProjectDialog;
