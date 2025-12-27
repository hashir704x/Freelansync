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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type PropsType = {
    openCreateReviewDialog: boolean;
    setOpenCreateReviewDialog: React.Dispatch<React.SetStateAction<boolean>>;
    freelancerName: string;
    freelancerId: string;
    clientId: string;
};

const array = [1, 2, 3, 4, 5];

const ClientCreateReviewDialog = (props: PropsType) => {
    const queryClient = useQueryClient();
    const [comment, setComment] = useState("");
    const [starsCount, setStarsCount] = useState(1);

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
            <AlertDialogContent className="sm:max-w-lg">
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

                <div className="mt-3">
                    <Textarea
                        placeholder="Type your message..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[120px] resize-none border-gray-200 focus-visible:ring-(--my-blue)"
                    />
                </div>

                <div>
                    <h3>How many stars would you give?</h3>
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
                            })
                        }
                        disabled={isPending || !comment.trim()}
                        className="flex items-center gap-2 bg-(--my-blue) hover:bg-(--my-blue-light) px-5 py-2 rounded-lg cursor-pointer"
                    >
                        {isPending ? <Spinner /> : <SendHorizonal className="w-4 h-4" />}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ClientCreateReviewDialog;
