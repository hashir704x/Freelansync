import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type PropsType = {
    action: "accept" | "reject";
};

const FreelancerConfirmInvitationDialog = (props: PropsType) => {

    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {props.action === "accept" ? (
                    <Button
                        variant="custom"
                        // disabled={isPending || rejectionPending}
                        className="mt-3"
                    >
                        {" "}
                        {true && <Spinner />}
                        Accept
                    </Button>
                ) : (
                    <Button
                        variant="destructive"
                        // disabled={rejectionPending || isPending}
                        className="mt-3 cursor-pointer"
                    >
                        {" "}
                        {true && <Spinner />}
                        Reject
                    </Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you really want to{" "}
                        {props.action === "accept" ? "accept" : "reject"} the invitation?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        className={`${
                            props.action === "accept"
                                ? "bg-(--my-blue) hover:bg-(--my-blue-light) cursor-pointer"
                                : "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                        } cursor-pointer`}
                    >
                        {props.action === "accept" ? "Accept" : "Reject"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default FreelancerConfirmInvitationDialog;
