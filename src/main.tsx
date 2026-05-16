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

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pages/:id", element: <SideBar /> },
  { path: "/callback", element: <AuthCallback /> },
  { path: "/bookmarks", element: <UserLayout title="العلامات المرجعية"><Bookmarks /></UserLayout> },
  { path: "/collections", element: <UserLayout title="المجلدات"><Collections /></UserLayout> },
  { path: "/settings", element: <UserLayout title="الإعدادات"><Settings /></UserLayout> },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
