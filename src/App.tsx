import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// public pages
import LandingPage from "./pages/public-pages/Landing-page";
import SignupPage from "./pages/public-pages/Signup-page";
import LoginPage from "./pages/public-pages/Login-page";

// layouts
import ClientLayout from "./layouts/Client-layout";

// client pages
import ClientProfileOwnPage from "./pages/client-pages/Client-profile-own-page";

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
                element: <ClientProfileOwnPage />,
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
