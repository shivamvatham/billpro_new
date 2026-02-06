import { lazy } from "react";

export type AppRoute = {
  title?: string;
  path?: string;
  element?: React.ComponentType;
  name?: string;
  icon?: string;
  hidden?: boolean;
  isActive?:boolean;
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
    title: "Dashboard",
    name: "dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
    element: lazy(() => import("@/pages/protected/dashboard/Dashboard")),
  },
  {
    title: "Sales",
    icon: "LayoutDashboard",
    name: "sales",
    children: [
      {
        title: "Sales List",
        icon: "LayoutDashboard",
        hidden: false,
        name: "sales.list",
        path: "/login",
        element: lazy(() => import("@/pages/protected/dashboard/Dashboard")),
      }
    ]
  },
];
