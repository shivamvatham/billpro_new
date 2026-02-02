import { lazy } from "react";

export type AppRoute = {
  path: string;
  element: React.ComponentType;
  name?: string;
  icon?: string;
  hidden?: boolean;
  children?: AppRoute[];
};

/* ---------- PUBLIC ROUTES ---------- */

export const publicRoute: AppRoute[] = [
  {
    name: "Login",
    path: "/login",
    element: lazy(() => import("@/pages/public/Login")),
  },
];

/* ---------- PROTECTED ROUTES ---------- */

export const protectedRoute: AppRoute[] = [
  {
    name: "dashboard",
    path: "/",
    element: lazy(() => import("@/pages/protected/dashboard/Dashboard")),
  },
];
