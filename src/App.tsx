import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// public pages
import LandingPage from "./pages/public-pages/Landing-page";
import SignupPage from "./pages/public-pages/Signup-page";
import LoginPage from "./pages/public-pages/Login-page";

// layouts
import ClientLayout from "./layouts/Client-layout";
import FreelancerLayout from "./layouts/Freelancer-layout";

// client pages
import ClientDashboard from "./pages/client-pages/Client-dashboard";
import ClientProfileOwnPage from "./pages/client-pages/Client-profile-own-page";
import CreateProjectPage from "./pages/client-pages/Create-project-page";
import ProjectDetialsClientPage from "./pages/client-pages/Project-details-client-page";

// freelancer pages
import FreelancerDashboard from "./pages/freelancer-pages/Freelancer-dashboard";
import FreelancerProfileOwnPage from "./pages/freelancer-pages/Freelancer-profile-own-page";
import AllProjectsPage from "./pages/client-pages/All-Projects-page";

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
            { index: true, element: <ClientDashboard /> },
            {
                path: "client-profile-own",
                element: <ClientProfileOwnPage />,
            },
            {
                path: "create-project",
                element: <CreateProjectPage />,
            },
            {
                path: "all-projects",
                element: <AllProjectsPage />,
            },
            {
                path: "project-details/:projectId",
                element: <ProjectDetialsClientPage />,
            },
        ],
    },
    {
        path: "/freelancer",
        element: <FreelancerLayout />,
        children: [
            { index: true, element: <FreelancerDashboard /> },
            { path: "freelancer-profile-own", element: <FreelancerProfileOwnPage /> },
        ],
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
