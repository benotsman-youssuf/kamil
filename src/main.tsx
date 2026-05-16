import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SideBar from "./layout/Sidebar.tsx";
import { Home } from "./pages/Home";
import { AuthCallback } from "./pages/AuthCallback";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pages/:id", element: <SideBar /> },
  { path: "/auth/callback", element: <AuthCallback /> },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
