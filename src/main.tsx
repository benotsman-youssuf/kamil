import { createRoot } from "react-dom/client";
import "./index.css";
import "@ahmedhamdan/dubai-font/css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import SideBar from "./layout/Sidebar.tsx";
import { Home } from "./pages/Home";
import { AuthCallback } from "./pages/AuthCallback";
import { UserLayout } from "./layout/UserLayout";
import { Collections } from "./pages/Collections";
import { Settings } from "./pages/Settings";
import { Stats } from "./pages/Stats";
import { Discover } from "./pages/Discover";
import { ReadPage } from "./pages/ReadPage";
import { RequireAuth } from "./components/RequireAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutPage() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("qf_tokens");
    localStorage.removeItem("qf_auth_state");
    localStorage.removeItem("qf_code_verifier");
    localStorage.removeItem("qf_nonce");
    navigate("/", { replace: true });
  }, [navigate]);
  return null;
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pages/:id", element: <SideBar /> },
  { path: "/callback", element: <AuthCallback /> },
  { path: "/logout", element: <LogoutPage /> },
  {
    path: "/discover",
    element: <UserLayout title="اكتشف"><Discover /></UserLayout>,
  },
  {
    path: "/read/:id",
    element: <ReadPage />,
  },
  {
    path: "/collections",
    element: <RequireAuth><UserLayout title="المجلدات"><Collections /></UserLayout></RequireAuth>,
  },
  {
    path: "/settings",
    element: <RequireAuth><UserLayout title="الإعدادات"><Settings /></UserLayout></RequireAuth>,
  },
  {
    path: "/stats",
    element: <RequireAuth><UserLayout title="إحصائياتي"><Stats /></UserLayout></RequireAuth>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <TooltipProvider>
    <RouterProvider router={router} />
  </TooltipProvider>
);
