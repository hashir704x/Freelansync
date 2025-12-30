import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";
import { SendHorizonal, Star } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { createReview } from "@/api-functions/reviews-functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkReviewExistance } from "@/api-functions/reviews-functions";

type PropsType = {
    openCreateReviewDialog: boolean;
    setOpenCreateReviewDialog: React.Dispatch<React.SetStateAction<boolean>>;
    freelancerName: string;
    freelancerId: string;
    clientId: string;
    projectId: string;
    projectTitle: string;
};

const array = [1, 2, 3, 4, 5];

const ClientCreateReviewDialog = (props: PropsType) => {
    const queryClient = useQueryClient();
    const [comment, setComment] = useState("");
    const [starsCount, setStarsCount] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryFn: () =>
            checkReviewExistance({
                clientId: props.clientId,
                freelancerId: props.freelancerId,
                projectId: props.projectId,
            }),
        queryKey: [
            "check-review-existance",
            props.clientId,
            props.freelancerId,
            props.projectId,
        ],
    });

    const { isPending, mutate } = useMutation({
        mutationFn: createReview,
        onSuccess() {
            toast.success("Review created successfully");
            props.setOpenCreateReviewDialog(false);
            setComment("");
            setStarsCount(1);
            queryClient.invalidateQueries({
                queryKey: ["get-freelancer-reviews", props.freelancerId],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "check-review-existance",
                    props.clientId,
                    props.freelancerId,
                    props.projectId,
                ],
            });
        },
        onError(error) {
            toast.error(`Failed to create review: ${error.message}`);
        },
    });

    return (
        <AlertDialog
            open={props.openCreateReviewDialog}
            onOpenChange={props.setOpenCreateReviewDialog}
        >
            <AlertDialogContent className="sm:max-w-lg p-4">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-(--my-blue)">
                        <Star className="w-5 h-5 fill-(--my-blue)" />
                        Give Review for {props.freelancerName}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tell about your working experience with {props.freelancerName} and
                        rate it by giving stars.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <p className="p-2 border bg-gray-100 rounded-md text-sm text-gray-800">
                    Review for project: {props.projectTitle}
                </p>

                {isLoading ? (
                    <div className="flex justify-center mt-2">
                        <Spinner />
                    </div>
                ) : isError ? (
                    <div className="text-red-500">Failed to check review status</div>
                ) : data === false ? (
                    <div>
                        <div className="mt-1">
                            <Textarea
                                placeholder="Type your message..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[120px] resize-none border-gray-200 focus-visible:ring-(--my-blue)"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm mt-3">
                                How many stars would you give?
                            </h3>
                            <div className="flex gap-2 items-center mt-1">
                                {array.map((item) => (
                                    <Star
                                        onClick={() => setStarsCount(item)}
                                        key={item}
                                        size={20}
                                        className={`${
                                            item <= starsCount && "fill-(--my-blue)"
                                        } cursor-pointer`}
                                    />
                                ))}
                            </div>
                        </div>

                        <AlertDialogFooter className="flex justify-between mt-5">
                            <AlertDialogCancel
                                onClick={() => {
                                    setComment("");
                                    setStarsCount(1);
                                }}
                                className="rounded-lg px-5 py-2 cursor-pointer"
                            >
                                Cancel
                            </AlertDialogCancel>

                            <Button
                                onClick={() =>
                                    mutate({
                                        clientId: props.clientId,
                                        comment: comment,
                                        freelancerId: props.freelancerId,
                                        stars: starsCount,
                                        projectId: props.projectId,
                                    })
                                }
                                disabled={isPending || !comment.trim()}
                                className="flex items-center gap-2 bg-(--my-blue) hover:bg-(--my-blue-light) px-5 py-2 rounded-lg cursor-pointer"
                            >
                                {isPending ? (
                                    <Spinner />
                                ) : (
                                    <SendHorizonal className="w-4 h-4" />
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </div>
                ) : (
                    <div>
                        <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
                            {/* Info message */}
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                                <p className="text-sm font-medium text-(--my-blue)">
                                    You have already submitted a review for this project
                                </p>
                            </div>

                            {/* Comment section */}
                            <div className="space-y-1">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Your comment
                                </h3>
                                <p className="text-sm leading-relaxed rounded-lg text-gray-800 py-1">
                                    {data?.comment}
                                </p>
                            </div>

                            {/* Star rating */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: data?.stars || 0 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className="fill-(--my-blue) text-(--my-blue)"
                                    />
                                ))}
                                <span className="ml-2 text-xs text-gray-500">
                                    {data?.stars}/5 stars
                                </span>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-lg px-5 py-2 cursor-pointer mt-3">
                                Cancel
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </div>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientCreateReviewDialog;
