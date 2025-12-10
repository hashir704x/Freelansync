import { getClientProfileOwnDataById } from "@/api-functions/client-function";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ClientProfileOwnPage = () => {
    const user = userStore((state) => state.user) as UserType;

    // local states
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, isError, isLoading } = useQuery({
        queryFn: () => getClientProfileOwnDataById(user.id),
        queryKey: ["get-client-profile-own-data"],
    });

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center">
                My Profile
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Client data</p>
                </div>
            )}

            {data && (
                <div className="flex justify-center items-center px-4 py-6">
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                        {/* Left Section — Profile Picture */}
                        <div className="flex flex-col items-center w-full md:w-1/3 text-center">
                            <img
                                src={preview || data.profile_pic}
                                alt="profile-img"
                                className="w-44 h-44 rounded-full object-cover border border-gray-200 shadow-sm"
                            />

                            <input
                                type="file"
                                accept="image/*"
                                id="profilePicInput"
                                // onChange={handleFileChange}
                                hidden
                                // disabled={isPending}
                            />
                            <label htmlFor="profilePicInput" className="bg-(--my-blue) text-white p-2 px-3 rounded-md mt-4 hover:bg-(--my-blue-light) cursor-pointer">Change Image</label>
                        </div>

                        {/* Right Section — Client Info */}
                        <div className="flex-1 w-full space-y-6 text-gray-700">
                            <h2 className="text-2xl font-semibold text-(--my-blue) border-b pb-2">
                                Client Profile
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="text-lg font-semibold">
                                        {data.username}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-lg font-semibold break-all">
                                        {data.email}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-lg font-semibold">{data.role}</p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Wallet Balance
                                    </p>
                                    <p className="text-lg font-semibold text-green-600">
                                        Rs {data.wallet_amount}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-sm text-gray-500">
                                        Account Created On
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {new Date(data.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientProfileOwnPage;
