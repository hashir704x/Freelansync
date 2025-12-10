import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { lazy, Suspense } from "react";
import { Spinner } from "./components/ui/spinner";

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense
        fallback={
            <div className="h-screen flex items-center justify-center">
                <Spinner className="size-8 text-(--my-blue)" />
            </div>
        }
    >
        {children}
    </Suspense>
);

// public pages
import LandingPage from "./pages/public-pages/Landing-page";
import SignupPage from "./pages/public-pages/Signup-page";
import LoginPage from "./pages/public-pages/Login-page";

// layouts
import ClientLayout from "./layouts/Client-layout";

// client pages
const ClientProfileOwnPage = lazy(
    () => import("@/pages/client-pages/Client-profile-own-page")
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/signup",
        element: <SignupPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/client",
        element: <ClientLayout />,
        children: [
            { index: true, element: <div></div> },
            {
                path: "client-profile-own",
                element: (
                    <LazyWrapper>
                        <ClientProfileOwnPage />
                    </LazyWrapper>
                ),
            },
        ],
    },
    {
        path: "/freelancer",
        element: <div>Freelancers page</div>,
    },
]);

const App = () => {
    return (
        <main>
            <RouterProvider router={router} />
            <Toaster />
        </main>
    );
};

export default App;
