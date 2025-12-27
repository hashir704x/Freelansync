import { getMilestoneDetailsById } from "@/api-functions/milestone-functions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { FileText, Lock, Upload, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import UpadateMilestoneStatusDialog from "@/components/update-milestone-status-dialog";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import SubmitMilestoneDialog from "@/components/submit-milestone-dialog";
import DeleteMilestoneSubmissionDialog from "@/components/delete-milestone-submission-dialog";

const MilestoneDetailsPage = () => {
    const user = userStore((state) => state.user) as UserType;
    const { milestoneId } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getMilestoneDetailsById(milestoneId as string),
        queryKey: ["get-milestone-details-by-id", milestoneId],
    });

    const [submissionDescription, setSubmissionDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        e.target.value = "";
    }

    function handleSubmission(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!submissionDescription) {
            toast.error("Submission description is required");
            return;
        }
        setOpenDialog(true);
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Milestone Details
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <Spinner className="size-8 text-(--my-blue)" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Milestone detailed data </p>
                </div>
            )}

            {data && (
                <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
                    {/* Milestone Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                            {data.title}
                        </h1>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            {data.description ||
                                "No description provided for this milestone."}
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm items-center">
                            <span className="px-4 py-1.5 font-medium text-white bg-(--my-blue) rounded-full shadow">
                                💰 Rs {data.amount.toLocaleString()}
                            </span>
                            <span className="px-4 py-1.5 font-medium text-white bg-(--my-blue) rounded-full shadow">
                                📅 {new Date(data.created_at).toLocaleDateString()}
                            </span>
                            <span
                                className={`px-4 py-1.5 font-medium rounded-full ${
                                    data.status === "LOCKED"
                                        ? "bg-red-100 text-red-700"
                                        : data.status === "IN_PROGRESS"
                                        ? "bg-blue-100 text-blue-700"
                                        : data.status === "SUBMITTED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                            >
                                {data.status.replace("_", " ")}
                            </span>
                        </div>
                        {user.role === "client" &&
                            user.id === data.client.id &&
                            data.status !== "COMPLETED" && (
                                <UpadateMilestoneStatusDialog
                                    milestoneStatus={data.status}
                                    milestoneId={milestoneId as string}
                                    projectId={data.project.id}
                                    freelancerId={data.freelancer.id}
                                    milestoneAmount={data.amount}
                                />
                            )}
                    </div>

                    {/* Project Details */}
                    <div>
                        <h2 className="text-2xl font-semibold text-(--my-blue) mb-4">
                            Relevant Project Details
                        </h2>

                        <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                            Title:{" "}
                            <span className="text-(--my-blue-light)">
                                {data.project.title}
                            </span>
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            {data.project.description ||
                                "No description provided for this project."}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 text-sm bg-(--my-blue-light)/20 text-(--my-blue) font-medium rounded-full border border-(--my-blue-light)">
                                Project Budget: Rs{" "}
                                {Number(data.project.budget).toLocaleString()}
                            </span>
                            <span className="px-4 py-1.5 text-sm bg-gray-100 text-gray-800 font-medium rounded-full border border-gray-200">
                                Status: {data.project.status}
                            </span>
                        </div>
                    </div>

                    {/* People */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Freelancer */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center w-[300px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <img
                                src={data.freelancer.profile_pic}
                                alt="freelancer"
                                className="w-24 h-24 rounded-full object-cover border-4 border-(--my-blue) shadow-sm"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mt-4">
                                {data.freelancer.username}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Freelancer</p>
                            <div className="w-full h-px bg-gray-100 my-4" />
                            {user.role === "freelancer" &&
                            user.id === data.freelancer.id ? (
                                <Link to="/freelancer/freelancer-profile-own">
                                    <Button variant="custom">View my profile</Button>
                                </Link>
                            ) : (
                                <Link
                                    to={`/client/freelancer-details/${data.freelancer.id}`}
                                >
                                    <Button variant="custom">View profile</Button>
                                </Link>
                            )}
                        </div>

                        {/* Client */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center w-[300px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                            <img
                                src={data.client.profile_pic}
                                alt="client"
                                className="w-24 h-24 rounded-full object-cover border-4 border-(--my-blue) shadow-sm"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mt-4">
                                {data.client.username}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Client</p>
                            <div className="w-full h-px bg-gray-100 my-4" />
                            {user.role === "client" && user.id === data.client.id ? (
                                <Link to="/client/client-profile-own">
                                    <Button variant="custom">View my profile</Button>
                                </Link>
                            ) : (
                                <Link to={`/freelancer/client-details/${data.client.id}`}>
                                    <Button variant="custom">View profile</Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* freelancer view */}
                    {user.role === "freelancer" && user.id === data.freelancer.id && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                Milestone Submission
                            </h2>

                            {data.status === "LOCKED" && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center mt-4">
                                    <Lock className="h-12 w-12 text-(--my-blue) mb-3" />
                                    <p className="text-gray-500 font-medium text-sm">
                                        Milestone is Locked
                                    </p>
                                </div>
                            )}

                            {data.status === "IN_PROGRESS" && (
                                <div>
                                    <form onSubmit={handleSubmission}>
                                        <div className="mb-4">
                                            <label className="text-gray-700 font-medium mb-1 block">
                                                Submission Description
                                            </label>
                                            <textarea
                                                value={submissionDescription}
                                                onChange={(e) =>
                                                    setSubmissionDescription(
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                placeholder="Explain what you have completed for this milestone..."
                                                className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-(--my-blue)"
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <label className="text-gray-800 font-semibold mb-2 block">
                                                Upload File{" "}
                                                <span className="text-gray-400 text-sm">
                                                    (optional)
                                                </span>
                                            </label>

                                            <div>
                                                {!selectedFile ? (
                                                    <div className="flex items-center gap-4">
                                                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition">
                                                            <Upload className="h-4 w-4 text-(--my-blue)" />
                                                            Choose file
                                                            <input
                                                                type="file"
                                                                onChange={
                                                                    handleFileChange
                                                                }
                                                                className="hidden"
                                                            />
                                                        </label>

                                                        <span className="text-xs text-gray-400">
                                                            PDF, ZIP, JPG • Max 3MB
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50">
                                                        <FileText className="h-4 w-4 text-(--my-blue)" />

                                                        <span className="text-sm text-gray-700 max-w-[220px] truncate">
                                                            {selectedFile.name}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedFile(null)
                                                            }
                                                            className="text-gray-400 hover:text-red-500 transition"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button type="submit" variant="custom">
                                            Submit Milestone
                                        </Button>
                                    </form>

                                    <SubmitMilestoneDialog
                                        openDialog={openDialog}
                                        setOpenDialog={setOpenDialog}
                                        selectedFile={selectedFile}
                                        submissionDescription={submissionDescription}
                                        projectId={data.project.id}
                                        clientId={data.client.id}
                                        freelancerUsername={user.username}
                                        projectTitle={data.project.title}
                                    />
                                </div>
                            )}

                            {(data.status === "SUBMITTED" ||
                                data.status === "COMPLETED") && (
                                <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                                    <div className="flex justify-between items-center flex-wrap gap-3">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Your Submission
                                        </h2>
                                        {data.status === "SUBMITTED" && (
                                            <DeleteMilestoneSubmissionDialog
                                                projectId={data.project.id}
                                                milestoneId={milestoneId as string}
                                                setSelectedFile={setSelectedFile}
                                                setSubmissionDescription={
                                                    setSubmissionDescription
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* Submission Description */}
                                    {data.submission_description && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {data.submission_description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Submitted File */}
                                    {data.file && (
                                        <div className="flex items-center justify-between p-4 gap-4 flex-wrap bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-(--my-blue)" />
                                                <span className="text-gray-700 max-w-[200px] truncate">
                                                    {data.file.split("/").pop()}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="custom">Download</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* client view */}
                    {user.role === "client" && user.id === data.client.id && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-(--my-blue) mb-4">
                                Milestone Submission Overview
                            </h2>

                            {data.status === "LOCKED" && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center mt-4">
                                    <Lock className="h-12 w-12 text-(--my-blue) mb-3" />
                                    <p className="text-gray-500 font-medium text-sm">
                                        Milestone is Locked
                                    </p>
                                </div>
                            )}

                            {data.status === "IN_PROGRESS" && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center mt-4">
                                    <FileText className="h-12 w-12 text-(--my-blue) mb-3" />
                                    <p className="text-gray-500 font-medium text-sm">
                                        No submissions yet
                                    </p>
                                </div>
                            )}

                            {(data.status === "SUBMITTED" ||
                                data.status === "COMPLETED") && (
                                <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Milestone Submission
                                    </h2>

                                    {/* Submission Description */}
                                    {data.submission_description && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {data.submission_description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Submitted File */}
                                    {data.file && (
                                        <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-(--my-blue)" />
                                                <span className="text-gray-700 max-w-[200px] truncate">
                                                    {data.file.split("/").pop()}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="custom">Download</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MilestoneDetailsPage;
