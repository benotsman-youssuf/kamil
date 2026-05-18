import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getValidAccessToken } from "@/lib/qf/auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    getValidAccessToken().then((token) => {
      setAuthenticated(!!token);
      setChecking(false);
    });
  }, []);

  if (checking) return null;
  if (!authenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
