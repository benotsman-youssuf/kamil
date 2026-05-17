import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getTokens } from "@/lib/qf/auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const tokens = getTokens();
  if (!tokens?.access_token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
