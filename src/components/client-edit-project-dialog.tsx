import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import type { ProjectDetailsByIdFromBackendType } from "@/Types";
import DomainPicker from "./domain-picker";
import SkillsPicker from "./skills-picker";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api-functions/project-functions";

const ClientEditProjectDialog = ({
    projectData,
}: {
    projectData: ProjectDetailsByIdFromBackendType;
}) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState(projectData.title);
    const [description, setDescription] = useState(projectData.description);
    const [skills, setSkills] = useState<string[]>(projectData.skills);
    const [domains, setDomains] = useState<string[]>(projectData.domains);

    const { mutate, isPending } = useMutation({
        mutationFn: updateProject,
        onSuccess() {
            toast.success("Project updated successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-project-details", projectData.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-projects-for-client"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-all-milestones-for-project", projectData.id],
            });

            setOpen(false);
        },
        onError(error) {
            toast.error(`Failed to edit project, ${error.message}`);
        },
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!title || !description || skills.length === 0 || domains.length === 0) {
            toast.warning("Fields are empty");
            return;
        }

        if (title.length < 4) {
            toast.warning("Project title must be atleast 4 letters long");
            return;
        }

        mutate({
            id: projectData.id,
            title: title,
            description: description,
            domains: domains,
            skills: skills,
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="custom">
                    <SquarePen />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="p-4">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Project {projectData.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can edit title, description, skills and domains linked to the
                        project
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white space-y-3 mt-2 text-sm sm:text-base"
                >
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

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            disabled={isPending}
                            variant="custom"
                            type="submit"
                            className="cursor-pointer"
                        >
                            {isPending && <Spinner />}
                            Update Project
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientEditProjectDialog;
