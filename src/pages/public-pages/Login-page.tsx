import { Link, Navigate, useNavigate } from "react-router-dom";
import { userStore } from "@/stores/user-store";
import Picture from "@/assets/login-image.png";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api-functions/auth-functions";

const LoginPage = () => {
    const navigate = useNavigate();

    // zustand states
    const user = userStore((state) => state.user);
    const setUser = userStore((state) => state.setUser);

    // local states
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: login,
        onSuccess(data) {
            toast.success("Login successfull!");
            setEmail("");
            setPassword("");
            setUser({
                id: data.id,
                email: data.email,
                profile_pic: data.profile_pic,
                role: data.role,
                username: data.username,
            });
            navigate(`/${data.role}`);
        },
        onError(error) {
            console.error("Login failed", error.message);
            const message =
                error.message.length > 100
                    ? error.message.substring(0, 100) + "..."
                    : error.message;
            toast.error(`Login failed! ${message}`);
        },
    });

    async function handleSignup(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password) {
            toast.warning("Feilds are empty!");
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
            email: email,
            password: password,
        });
    }

    if (user && user.role === "client") return <Navigate to="/client" />;
    else if (user && user.role === "freelancer") return <Navigate to="/freelancer" />;

    return (
        <div className="flex h-screen">
            <div className="flex-[1.5] flex flex-col items-center justify-center">
                <div>
                    <h1 className="text-xl text-center sm:text-3xl font-medium">
                        Login to your account
                    </h1>
                    <p className="text-center text-sm mt-1">
                        New here?{" "}
                        <Link to="/signup">
                            <span className="underline cursor-pointer">
                                Create Account
                            </span>
                        </Link>
                    </p>
                </div>

                <form
                    onSubmit={handleSignup}
                    className="w-[340px] sm:w-[450px]  mt-5 flex flex-col gap-4 border p-6 rounded-xl shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
                >
                    <div>
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

                    <div className="relative">
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

                    <Button
                        disabled={isPending}
                        type="submit"
                        variant="custom"
                        className="mt-2 cursor-pointer"
                    >
                        {isPending && <Spinner />}
                        Login
                    </Button>
                </form>
            </div>
            <div className="flex-1 hidden lg:block">
                <img src={Picture} alt="picture" className="h-full w-full object-cover" />
            </div>
        </div>
    );
};

export default LoginPage;
