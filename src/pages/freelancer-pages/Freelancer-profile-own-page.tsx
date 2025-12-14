import {
    getFreelancerProfileOwnDataById,
    updateFreelancerProfileImage,
} from "@/api-functions/freelancer-functions";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FreelancerProfileOwnPage = () => {
    const user = userStore((state) => state.user) as UserType;
    const setUser = userStore((state) => state.setUser);

    // local states
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, isError, isLoading } = useQuery({
        queryFn: () => getFreelancerProfileOwnDataById(user.id),
        queryKey: ["get-freelancer-profile-own-data"],
    });

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        e.target.value = "";
    }

    const { mutate, isPending } = useMutation({
        mutationFn: updateFreelancerProfileImage,
        onSuccess(url) {
            setSelectedFile(null);
            setPreview(null);
            setUser({ ...user, profile_pic: url });
            toast.success("Profile image updated successfully");
        },
        onError(error) {
            toast.error(`Failed to change image, ${error.message}`);
        },
    });

    return (
        <div>
        <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                My Profile
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Freelancer data</p>
                </div>
            )}

            {data && (
                <div>
                    <div className="p-7 md:p-10 flex flex-col items-center gap-10">
                        {/* Upper Section — Profile Picture */}
                        <div className="flex flex-col items-center relative overflow-hidden">
                            {isPending && (
                                <div className="bg-black/40 w-48 h-48 z-10 absolute rounded-full flex justify-center items-center">
                                    <Spinner className="w-8 h-8 text-white" />
                                </div>
                            )}

                            <img
                                src={preview || user.profile_pic}
                                alt="profile-img"
                                className="w-48 h-48 rounded-full object-cover border border-gray-200"
                            />
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profilePicInput"
                                    onChange={handleFileChange}
                                    hidden
                                    disabled={isPending}
                                />
                                {selectedFile ? (
                                    <button
                                        onClick={() =>
                                            mutate({
                                                freelancerId: user.id,
                                                file: selectedFile,
                                            })
                                        }
                                        disabled={isPending}
                                        className="bg-(--my-blue) text-white p-2 rounded-md mt-4 hover:bg-(--my-blue-light) disabled:bg-(--my-blue-light)/30"
                                    >
                                        <CircleCheck size={30} />
                                    </button>
                                ) : (
                                    <label
                                        htmlFor="profilePicInput"
                                        className="bg-(--my-blue) text-white p-2 px-3 rounded-md mt-4 hover:bg-(--my-blue-light) cursor-pointer"
                                    >
                                        Change Image
                                    </label>
                                )}

                                {selectedFile && (
                                    <button
                                        disabled={isPending}
                                        onClick={() => {
                                            setPreview(null);
                                            setSelectedFile(null);
                                        }}
                                        className="bg-red-700 text-white p-2 rounded-lg mt-4 hover:bg-red-600 cursor-pointer disabled:bg-red-300"
                                    >
                                        <CircleX size={30} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Bottom Section — Freelancer Info */}
                        <div className="w-full space-y-6 text-gray-700">
                            <h2 className="text-2xl font-semibold text-(--my-blue) border-b pb-2">
                                Freelancer Profile
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

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
                                    <p className="text-sm text-gray-500">
                                        Account Created On
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {new Date(data.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-sm text-gray-500 mb-3">Domains</p>

                                    <div className="flex flex-wrap gap-2">
                                        {data.domains.map(
                                            (domain: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-(--my-blue)/10 text-(--my-blue) font-medium rounded-full text-sm shadow-sm hover:bg-(--my-blue)/20 transition-colors"
                                                >
                                                    {domain}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm sm:col-span-2">
                                    <p className="text-sm text-gray-500 mb-3">Skillset</p>

                                    <div className="flex flex-wrap gap-2">
                                        {data.skills.map(
                                            (skill: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-(--my-blue)/10 text-(--my-blue) font-medium rounded-full text-sm shadow-sm hover:bg-(--my-blue)/20 transition-colors"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FreelancerProfileOwnPage;
