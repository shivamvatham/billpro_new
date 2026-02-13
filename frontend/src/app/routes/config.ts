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
    title: "Customers",
    icon: "UsersRound",
    name: "customers",
    children: [
      {
        title: "Customer List",
        icon: "LayoutDashboard",
        name: "customer.list",
        path: "/customer/list",
        element: lazy(() => import("@/pages/protected/customers/CustomerList")),
      },
      {
        title: "Add Customer",
        icon: "UserRoundPlus",
        name: "customer.addcustomer",
        path: "/customer/add",
        element: lazy(() => import("@/pages/protected/customers/AddCustomer")),
      },
      {
        title: "Edit Customer",
        icon: "UserRoundPen",
        name: "customer.editcustomer",
        hidden: true,
        path: "/customer/edit/:id",
        element: lazy(() => import("@/pages/protected/customers/EditCustomer")),
      }
    ]
  },
  {
    title: "Settings",
    icon: "Settings",
    name: "settings",
    path: '/settings',
    element: lazy(()=> import("@/pages/protected/settings/SettingsConfig")),
    children: [
      {
        title: "General Settings",
        name: "settings.general",
        path: "/settings/general",
        hidden: true,
        element: lazy(() => import("@/pages/protected/settings/General")),
      },
      {
        title: "Portal Settings",
        name: "settings.portal",
        path: "/settings/portal",
        hidden: true,
        element: lazy(() => import("@/pages/protected/settings/Portal")),
      }
    ]
  }
];
