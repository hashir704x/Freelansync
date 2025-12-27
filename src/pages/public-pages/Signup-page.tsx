import { Link, useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { userStore } from "@/stores/user-store";
import Picture from "@/assets/signup-image.png";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SkillsPicker from "@/components/skills-picker";
import { Spinner } from "@/components/ui/spinner";
import DomainPicker from "@/components/domain-picker";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api-functions/auth-functions";

const SignupPage = () => {
    const [searchParams] = useSearchParams();
    const activeSearch = searchParams.get("active");
    const navigate = useNavigate();

    // zustand states
    const user = userStore((state) => state.user);
    const setUser = userStore((state) => state.setUser);

    // local states
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [domains, setDomains] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [role, setRole] = useState<"client" | "freelancer" | "">(() => {
        if (activeSearch === "client") return "client";
        else if (activeSearch === "freelancer") return "freelancer";
        else return "";
    });

    const { mutate, isPending } = useMutation({
        mutationFn: signup,
        onSuccess(data) {
            toast.success("Signup successfull!");
            setUsername("");
            setEmail("");
            setPassword("");
            setDescription("");
            setDomains([]);
            setSkills([]);

            setUser({
                id: data.id,
                email: data.email,
                profile_pic: data.profile_pic,
                role: data.role,
                username: data.username
            });
            navigate(`/${data.role}`);
        },
        onError(error) {
            toast.error(`Signup failed! ${error.message}`);
        },
    });

    async function handleSignup(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!username || !email || !password || !role) {
            toast.warning("Feilds are empty!");
            return;
        }
        if (role === "freelancer" && (skills.length === 0 || !description)) {
            toast.warning("Feilds are empty!");
            return;
        }
        if (username.length < 3) {
            toast.warning("Username is too short!");
            return;
        }
        if (password.length < 6) {
            toast.warning("Password should be atleast 6 letters!");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.warning("Invalid email address");
            return;
        }

        mutate({
            username: username,
            email: email,
            password: password,
            role: role,
            description: description,
            domains: domains,
            skills: skills,
        });
    }

    if (user && user.role === "client") return <Navigate to="/client" />;
    else if (user && user.role === "freelancer") return <Navigate to="/freelancer" />;

    return (
        <div className="flex h-screen">
            <div className="flex-[1.5] flex flex-col items-center justify-center">
                <div>
                    <h1 className="text-xl text-center sm:text-3xl font-medium">
                        Create an account
                    </h1>
                    <p className="text-center text-sm mt-1">
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="underline cursor-pointer">Login</span>
                        </Link>
                    </p>
                </div>
                <form
                    onSubmit={handleSignup}
                    className="w-[340px] sm:w-fit mt-5 flex flex-col gap-4 border p-6 rounded-xl shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label htmlFor="username" className="text-sm">
                                Username
                            </label>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="text-sm"
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="email" className="text-sm">
                                Email
                            </label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                            <label htmlFor="password" className="text-sm">
                                Password
                            </label>
                            <Input
                                type={`${showPassword ? "text" : "password"}`}
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-sm"
                            />
                            <span
                                className="absolute right-2.5 bottom-1.5 sm:bottom-1.5 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </span>
                        </div>

                        <div className="flex-1">
                            <p className="mb-1 text-sm">Select your role</p>
                            <Select
                                value={role}
                                onValueChange={(value: "client" | "freelancer") =>
                                    setRole(value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="freelancer">Freelancer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {role && role === "freelancer" && (
                        <div className="flex flex-col gap-3">
                            <div>
                                <label htmlFor="freelancer-desc" className="text-sm">
                                    Description
                                </label>
                                <textarea
                                    id="freelancer-desc"
                                    rows={5}
                                    placeholder="Describe your work or profession"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 border border-gray-300 rounded-md px-3 py-2 outline-none resize-none w-full"
                                />
                            </div>

                            <div>
                                <p className="text-sm mb-1">
                                    Pick your Domain (Create if not present)
                                </p>
                                <DomainPicker value={domains} onChange={setDomains} />
                            </div>

                            <div>
                                <p className="text-sm mb-1">
                                    Pick your specific skills (Create if not present)
                                </p>
                                <SkillsPicker value={skills} onChange={setSkills} />
                            </div>
                        </div>
                    )}

                    <Button
                        disabled={isPending}
                        type="submit"
                        variant="custom"
                        className="mt-2 cursor-pointer"
                    >
                        {isPending && <Spinner />}
                        Create Account
                    </Button>
                </form>
            </div>
            <div className="flex-1 hidden lg:block">
                <img src={Picture} alt="picture" className="h-full w-full object-cover" />
            </div>
        </div>
    );
};

export default SignupPage;
