import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SideBar from "./layout/Sidebar.tsx";
import { Home } from "./pages/Home";
import { AuthCallback } from "./pages/AuthCallback";
import { UserLayout } from "./layout/UserLayout";
import { Bookmarks } from "./pages/Bookmarks";
import { Collections } from "./pages/Collections";
import { Settings } from "./pages/Settings";
import { Stats } from "./pages/Stats";
import { RequireAuth } from "./components/RequireAuth";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pages/:id", element: <SideBar /> },
  { path: "/callback", element: <AuthCallback /> },
  {
    path: "/bookmarks",
    element: <RequireAuth><UserLayout title="العلامات المرجعية"><Bookmarks /></UserLayout></RequireAuth>,
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
  <RouterProvider router={router} />
);
