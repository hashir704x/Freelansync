import face1 from "@/assets/face1.webp";
import face2 from "@/assets/face2.webp";
import face3 from "@/assets/face3.jpeg";
import face4 from "@/assets/face4.webp";
import face5 from "@/assets/face5.webp";
import face6 from "@/assets/face6.webp";

import { Computer, Palette, Bot, BookOpen, Camera, DollarSign, Star } from "lucide-react";

const sliderItemsData = [
    {
        icon: Computer,
        label: "Dev & IT",
        para: "Haris came in and helped us transfer knowledge from our departing developer, meeting a serious deadline, without fail. His knowledge and experience are exceptional.",
        name: "Haris S.",
        profession: "Full-Stack Developer",
        date: "Apr 7, 2025",
        face: face1,
        rating: 5,
    },
    {
        icon: Palette,
        label: "Design & Creative",
        para: "Ayesha delivered stunning UI/UX designs that completely transformed our app. Her creativity and attention to detail were beyond expectations.",
        name: "Ayesha K.",
        profession: "UI/UX Designer",
        date: "Mar 15, 2025",
        face: face2,
        rating: 4,
    },
    {
        icon: Bot,
        label: "AI & Data",
        para: "Ali built a machine learning model that improved our recommendation system dramatically. His expertise in AI gave us a real competitive edge.",
        name: "Ali R.",
        profession: "Data Scientist",
        date: "Feb 22, 2025",
        face: face3,
        rating: 5,
    },
    {
        icon: BookOpen,
        label: "Admin & Support",
        para: "Sana managed our customer support with professionalism and warmth. She kept everything organized and clients happy throughout.",
        name: "Sana M.",
        profession: "Virtual Assistant",
        date: "Jan 30, 2025",
        face: face4,
        rating: 5,
    },
    {
        icon: Camera,
        label: "Photography",
        para: "Usman captured our corporate event perfectly. The photos were crisp, professional, and delivered right on time.",
        name: "Usman T.",
        profession: "Photographer",
        date: "Dec 18, 2024",
        face: face5,
        rating: 3,
    },
    {
        icon: DollarSign,
        label: "Finance",
        para: "Zara streamlined our bookkeeping and financial reporting. Her clear communication and accuracy saved us countless hours.",
        name: "Zara L.",
        profession: "Accountant",
        date: "Nov 5, 2024",
        face: face6,
        rating: 5,
    },
];

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const count = [1, 2, 3, 4, 5];

const LandingPageSlider = () => {
    return (
        <div>
            <h1 className="text-2xl sm:text-4xl font-medium">
                Real results from clients
            </h1>
            <Carousel opts={{ loop: true, align: "start" }} className="relative mt-6">
                <CarouselContent>
                    {sliderItemsData.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="
                                basis-full      
                                sm:basis-1/2    
                                lg:basis-1/3     
                                py-6 px-4 md:px-8"
                        >
                            <div className="flex text-(--my-blue) items-center gap-2">
                                <item.icon /> {item.label}
                            </div>

                            <p className="mt-4 text-sm sm:text-base leading-relaxed">
                                "{item.para}"
                            </p>

                            <div className="flex gap-1 mt-2">
                                {count.map((star, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={`${
                                            star <= item.rating
                                                ? "fill-blue-600 stroke-blue-600"
                                                : "stroke-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-gray-600">{item.profession}</p>
                                    <p className="text-gray-400 text-xs">{item.date}</p>
                                </div>
                                <img
                                    src={item.face}
                                    alt={item.name}
                                    className="rounded-full w-14 h-14 object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Controls */}
                <div className="absolute top-[-3px] right-[50px] sm:static sm:top-auto sm:right-auto">
                    <CarouselPrevious className="flex text-white bg-(--my-blue)" />
                    <CarouselNext className="flex text-white bg-(--my-blue)" />
                </div>
            </Carousel>
        </div>
    );
};

export default LandingPageSlider;
