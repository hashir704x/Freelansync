import { getAllReviewsForFreelancer } from "@/api-functions/reviews-functions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { Star, UserStar } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const FreelancerReviewsComponent = ({ freelancerId }: { freelancerId: string }) => {
    const { isLoading, data } = useQuery({
        queryFn: () => getAllReviewsForFreelancer(freelancerId),
        queryKey: ["get-freelancer-reviews", freelancerId],
    });

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold text-(--my-blue)">Reviews</h2>

            {isLoading && (
                <div className="flex justify-center mt-10">
                    <Spinner />
                </div>
            )}

            {data && data.length === 0 && (
                <div className="flex flex-col items-center justify-center w-full mt-10">
                    <div className="p-2 border bg-gray-200 rounded-lg">
                        <UserStar size={24} fill="true" />
                    </div>
                    <h2 className="text-xl font-medium mt-2">No Reviews Yet</h2>
                    <p className="w-[320px] text-center mt-2 text-gray-500 font-medium">
                        This freelancer has no reviews yet.
                    </p>
                </div>
            )}

            {data && data.length >= 1 && (
                <div className="py-10">
                    <Carousel
                        opts={{ loop: true, align: "start" }}
                        className="relative mt-6"
                    >
                        <CarouselContent className="p-2">
                            {data.map((item) => (
                                <CarouselItem
                                    key={item.id}
                                    className="basis-full sm:basis-1/2 lg:basis-1/3   p-4"
                                >
                                    <div className="h-full w-full p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl flex flex-col justify-between">
                                        <p className="mt-4 text-sm sm:text-base leading-relaxed">
                                            "{item.comment}"
                                        </p>

                                        <div className="flex gap-1 mt-2">
                                            {Array.from({ length: item.stars }).map(
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={18}
                                                        className="fill-(--my-blue)"
                                                    />
                                                )
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-6">
                                            <div className="text-sm">
                                                <p className="font-semibold">
                                                    {item.client.username}
                                                </p>

                                                <p className="text-gray-400 text-xs">
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <img
                                                src={item.client.profile_pic}
                                                alt="pfp"
                                                className="rounded-full w-14 h-14 object-cover"
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="absolute top-[-3px] right-[50px]">
                            <CarouselPrevious className="flex text-white bg-(--my-blue)" />
                            <CarouselNext className="flex text-white bg-(--my-blue)" />
                        </div>
                    </Carousel>
                </div>
            )}
        </div>
    );
};

export default FreelancerReviewsComponent;
