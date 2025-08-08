import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SideBar from "./layout/Sidebar.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/pages/:id", element: <SideBar /> },
]);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
