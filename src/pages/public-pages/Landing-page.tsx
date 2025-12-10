import { userStore } from "../../stores/user-store";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BannerImage from "@/assets/landing-page-image.jpg";
import { Search } from "lucide-react";
import { cardsData } from "@/static-content/landing-page-static-content";
import LandingPageSlider from "@/components/landing-page-slider";
import { SiGithub, SiLinkedin, SiFacebook } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const LandingPage = () => {
    const user = userStore((state) => state.user);
    return (
        <section>
            <header className="py-4 px-3 sm:px-6 flex items-center justify-between">
                <h1 className="font-semibold text-2xl">Freelansync</h1>

                {user ? (
                    <div>
                        <Link to={user.role === "client" ? "/client" : "/freelancer"}>
                            <Button variant="custom">Home</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/signup">
                            <Button variant="custom">Signup</Button>
                        </Link>

                        <Link to="/login">
                            <Button variant="custom">Login</Button>
                        </Link>
                    </div>
                )}
            </header>

            <div className="sm:px-10 lg:px-16 flex flex-col gap-10">
                {/* Banner section */}
                <div className="h-[420px] sm:h-[550px] sm:mt-8 relative rounded-3xl sm:overflow-hidden">
                    <img
                        src={BannerImage}
                        alt="Banner-image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60" />
                    <div className="absolute top-32 sm:top-14 sm:left-12 sm:w-[650px] px-5">
                        <h1 className="text-3xl sm:text-7xl sm:leading-20 font-semibold text-white text-wrap">
                            Connecting clients in need to freelancers who deliver
                        </h1>

                        <div className="w-fit mt-2">
                            {!user ? (
                                <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-8 flex-col sm:flex-row">
                                    <Link to="/signup?active=client">
                                        <Button
                                            variant="custom"
                                            className="sm:p-6 font-medium sm:text-lg w-[250px]"
                                        >
                                            Signup as Client
                                        </Button>
                                    </Link>
                                    <Link to="/signup?active=freelancer">
                                        <Button
                                            variant="custom"
                                            className="sm:p-6 font-medium sm:text-lg w-[250px]"
                                        >
                                            Signup as Freelancer
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to={user.role === "client" ? "/client" : "freelancer"}
                                >
                                    <Button variant="custom" className="w-[150px] h-10">
                                        Start working
                                    </Button>
                                </Link>
                            )}

                            <Link to="#">
                                <button className="mt-3 bg-white text-(--my-blue) font-semibold flex justify-center items-center gap-3 h-8 sm:h-10 rounded-sm cursor-pointer  w-full text-sm">
                                    Search People <Search size={20} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-4 flex flex-col gap-16">
                    {/* small cards section */}
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-medium">
                            Explore Different Pros
                        </h1>

                        <div className="flex flex-wrap justify-center gap-8 mt-8">
                            {cardsData.map((card, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 items-center justify-center w-[145px] h-[100px] sm:w-60 sm:h-40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                                >
                                    <div className="text-(--my-blue)">
                                        <card.icon size={30} />
                                    </div>
                                    <h2 className="font-medium text-xs sm:text-lg">
                                        {card.label}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* slider */}
                    <LandingPageSlider />

                    <div className="bg-linear-to-tl from-[#3658c9] via-[#0a1739] to-[#3658c9] h-[180px] sm:h-[260px] rounded-lg flex flex-col items-center justify-center gap-8 px-4">
                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-white">
                            Find your next hire for a short task or long-term growth
                        </h1>
                        <Link to="#">
                            <button className="text-black bg-white p-3 text-xs sm:text-lg rounded-lg cursor-pointer">
                                Explore Freelancers
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <footer className="bg-black text-gray-300 py-10 mt-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-white text-2xl font-bold">Freelansync</h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Connecting clients and freelancers for short tasks and
                            long-term projects.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="hover:text-white">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                        <div className="flex gap-4 mt-4 items-center">
                            <Link
                                to="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition"
                                aria-label="GitHub"
                            >
                                <SiGithub size={20} />
                            </Link>

                            <Link
                                to="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition"
                                aria-label="LinkedIn"
                            >
                                <SiLinkedin size={20} />
                            </Link>

                            <Link
                                to="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition"
                                aria-label="Facebook"
                            >
                                <SiFacebook size={20} />
                            </Link>

                            <Link
                                to="mailto:info@example.com"
                                className="text-gray-300 hover:text-white transition"
                                aria-label="Email"
                            >
                                <MdEmail size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-6">
                    <p className="text-center text-sm text-gray-500 py-4">
                        © {new Date().getFullYear()} FYP App. All rights reserved.
                    </p>
                </div>
            </footer>
        </section>
    );
};

export default LandingPage;
