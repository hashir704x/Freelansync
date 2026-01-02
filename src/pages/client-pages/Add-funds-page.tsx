import { getUserWalletFunds } from "@/api-functions/client-function";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { addFundsIntoClientWallet } from "@/api-functions/client-function";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const AddFundsPage = () => {
    const user = userStore((state) => state.user) as UserType;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isLoading, isError, data } = useQuery({
        queryFn: () => getUserWalletFunds({ userId: user.id, userRole: user.role }),
        queryKey: ["get-client-wallet-funds"],
    });

    const [funds, setFunds] = useState(0);

    const { mutate, isPending } = useMutation({
        mutationFn: addFundsIntoClientWallet,
        onSuccess() {
            toast.success("Funds added successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-client-wallet-funds"],
            });
            navigate("/client");
        },
        onError(error) {
            toast.error(`Failed to add funds, ${error.message}`);
        },
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (data) {
            if (funds === 0) {
                toast.warning("Cannot add 0 fund");
                return;
            }
            mutate({
                addedFunds: funds,
                userId: user.id,
                walletAmount: data.wallet_amount,
                clientId: user.id,
            });
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Add Funds Page
            </h1>

            {isLoading && (
                <div className="mt-44 flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="mt-44 flex justify-center items-center w-full">
                    <p>Error in getting wallet data</p>
                </div>
            )}

            {data && (
                <form className="mt-44 flex justify-center" onSubmit={handleSubmit}>
                    <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        {/* Wallet Balance */}
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Current Wallet Balance
                            </p>
                            <h3 className="mt-1 text-3xl font-semibold text-gray-900">
                                Rs {data.wallet_amount}
                            </h3>
                        </div>

                        {/* Add Funds */}
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="budget"
                                className="text-sm font-medium text-gray-700"
                            >
                                Add funds to your wallet
                            </label>

                            <input
                                disabled={isPending}
                                id="budget"
                                type="number"
                                min={0}
                                value={funds}
                                onChange={(e) => setFunds(Number(e.target.value))}
                                placeholder="Enter amount"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition
                           focus:border-(--my-blue) focus:ring-2 focus:ring-(--my-blue)/20"
                            />

                            <p className="text-xs text-gray-500">
                                Funds will be instantly available in your wallet
                            </p>
                        </div>

                        <Button
                            disabled={isPending}
                            type="submit"
                            variant="custom"
                            className="w-full rounded-lg py-2.5 text-sm font-medium"
                        >
                            {isPending && <Spinner />} Add Funds
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddFundsPage;
