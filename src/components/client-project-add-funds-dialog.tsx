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
import { useState } from "react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserWalletFunds } from "@/api-functions/client-function";
import { addFundsToProject } from "@/api-functions/project-functions";
import { toast } from "sonner";

type PropsType = {
    userId: string;
    projectId: string;
    projectCurrentBudget: number;
    projectOriginalBudget: number;
};

const ClientProjectAddFundsDialog = (props: PropsType) => {
    const [open, setOpen] = useState(false);
    const [addFundsAmount, setAddFundsAmount] = useState(0);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: addFundsToProject,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["get-client-wallet-funds"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-project-details", props.projectId],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-projects-for-client"],
            });

            setOpen(false);
            setAddFundsAmount(0);
        },
        onError(error) {
            toast.error(`Failed to add funds : ${error.message}`);
        },
    });
    const { isLoading, isError, data } = useQuery({
        queryFn: () => getUserWalletFunds({ userId: props.userId, userRole: "client" }),
        queryKey: ["get-client-wallet-funds"],
    });

    function handleClick() {
        if (data) {
            if (addFundsAmount > data.wallet_amount) {
                toast.warning("Added funds cannot be greater than wallet balance!");
                return;
            }

            mutate({
                projectId: props.projectId,
                clientBalance: data.wallet_amount,
                addedFunds: addFundsAmount,
                projectCurrentBudget: props.projectCurrentBudget,
                projectOriginalBudget: props.projectOriginalBudget,
                clientId: props.userId,
            });
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="custom">
                    <Wallet />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4">
                <AlertDialogHeader>
                    <AlertDialogTitle>Add funds to project</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    You can add more funds to this project from your wallet.
                </AlertDialogDescription>

                {isLoading && (
                    <div className="flex justify-center mt-2">
                        <Spinner />
                    </div>
                )}

                {isError && (
                    <div className="text-red-500">Failed to get wallet balance</div>
                )}

                {data && (
                    <div>
                        <div className="space-y-6">
                            {/* Wallet Card */}
                            <div className="rounded-xl border border-gray-200 bg-white py-3 px-4 shadow-sm">
                                <p className="text-sm text-gray-500">Wallet Balance</p>
                                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                                    Rs {data.wallet_amount}
                                </h3>
                            </div>

                            {/* Add Funds Input */}
                            <div className="flex flex-col space-y-2">
                                <label
                                    htmlFor="budget"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Add funds to this project
                                </label>

                                <div className="relative">
                                    <input
                                        id="budget"
                                        type="number"
                                        min={0}
                                        value={addFundsAmount}
                                        onChange={(e) =>
                                            setAddFundsAmount(Number(e.target.value))
                                        }
                                        placeholder="Enter amount"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-(--my-blue) focus:ring-2 focus:ring-(--my-blue)/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel disabled={isPending}>
                                Cancel
                            </AlertDialogCancel>
                            <Button
                                disabled={addFundsAmount === 0 || isPending}
                                variant="custom"
                                className="cursor-pointer"
                                onClick={handleClick}
                            >
                                {isPending && <Spinner />}
                                Add funds
                            </Button>
                        </AlertDialogFooter>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientProjectAddFundsDialog;
