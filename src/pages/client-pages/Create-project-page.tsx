import { useState } from "react";
import SkillsPicker from "@/components/skills-picker";
import DomainPicker from "@/components/domain-picker";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/api-functions/project-functions";
import { userStore } from "@/stores/user-store";
import type { UserType } from "@/Types";
import { useNavigate } from "react-router-dom";

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // zustand states
    const user = userStore((state) => state.user) as UserType;

    // local states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState<number>(0);
    const [skills, setSkills] = useState<string[]>([]);
    const [domains, setDomains] = useState<string[]>([]);

    const { isPending, mutate } = useMutation({
        mutationFn: createProject,
        onSuccess(id) {
            navigate(`/client/project-details/${id}`);
            queryClient.invalidateQueries({
                queryKey: ["get-all-projects-for-client"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-client-wallet-funds"],
            });
        },
        onError(error) {
            toast.error(`Failed to create project, ${error.message}`);
        },
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!title || !description || skills.length === 0 || domains.length === 0) {
            toast.warning("Fields are empty");
            return;
        }

        if (title.length < 4) {
            toast.warning("Project title must atleast 4 letters long");
            return;
        }

        if (budget < 5000) {
            toast.warning("Budget must be min Rs 5000");
            return;
        }

        mutate({
            title: title,
            clientId: user.id,
            budget: budget,
            description: description,
            domains: domains,
            skills: skills,
        });
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold h-[60px] border-b flex justify-center items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                Create New Project
            </h1>

            <div className="max-w-3xl mx-auto mt-4 rounded-md p-3">
                <h1 className="text-2xl font-semibold text-(--my-blue)">
                    Create your new project
                </h1>

                <form onSubmit={handleSubmit} className="bg-white space-y-5 mt-2">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="title" className="font-medium text-gray-700">
                            Project Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. E-commerce Website"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="description"
                            className="font-medium text-gray-700"
                        >
                            Project Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            placeholder="Describe your project in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="budget" className="font-medium text-gray-700">
                            Estimated Budget (min Rs 5000)
                        </label>
                        <input
                            id="budget"
                            type="number"
                            min={0}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-(--my-blue)"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Project Domains
                        </label>
                        <DomainPicker value={domains} onChange={setDomains} />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Required Technologies
                        </label>
                        <SkillsPicker value={skills} onChange={setSkills} />
                    </div>

                    <Button disabled={isPending} variant="custom" type="submit">
                        {isPending && <Spinner />}
                        Create Project
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectPage;
