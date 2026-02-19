import { lazy } from "react";

export type AppRoute = {
  title?: string;
  path?: string;
  element?: React.ComponentType;
  name?: string;
  icon?: string;
  hidden?: boolean;
  isActive?: boolean;
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
    icon: "ShoppingCart",
    name: "sales",
    children: [
      {
        title: "Series List",
        name: "sales.series.list",
        icon: "List",
        path: "/sales/series/list",
        element: lazy(() => import("@/pages/protected/sales/sales-series/SalesSeriesList")),
      },
      {
        title: "Add Series",
        name: "sales.series.add",
        icon: "Plus",
        path: "/sales/series/add",
        element: lazy(() => import("@/pages/protected/sales/sales-series/AddSalesSeries")),
      },
      {
        title: "Edit Series",
        name: "sales.series.edit",
        path: "/sales/series/edit/:id",
        hidden: true,
        element: lazy(() => import("@/pages/protected/sales/sales-series/EditSalesSeries")),
      },
    ],
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
      },
    ],
  },
  {
    title: "Products",
    icon: "Package",
    name: "products",
    children: [
      {
        title: "Product List",
        name: "products.list",
        path: "/products",
        icon: "Package",
        element: lazy(
          () => import("@/pages/protected/products/ProductList")
        ),
      },
      {
        title: "Product Units",
        name: "products.units",
        path: "/product-unit",
        icon: "Scale",
        element: lazy(
          () => import("@/pages/protected/product-units/ProductUnitList")
        ),
      },
      {
        title: "Product Categories",
        name: "products.categories",
        path: "/product-category",
        icon: "FolderTree",
        element: lazy(
          () => import("@/pages/protected/product-categories/ProductCategoryList")
        ),
      },
    ],
  },
   {
    title: "Purchase",
    icon: "Stone",
    name: "purchase",
    children: [
      {
      
      },
    ],
  },
  {
    title: "Accounts",
    icon: "Wallet",
    name: "accounts",
    children: [
      {
        title: "Account List",
        name: "accounts.list",
        path: "/accounts",
        icon: "Wallet",
        element: lazy(() => import("@/pages/protected/accounts/AccountList")),
      },
      {
        title: "Expense Categories",
        name: "accounts.expensecategories",
        path: "/expense-categories",
        icon: "Tags",
        element: lazy(() => import("@/pages/protected/accounts/ExpenseCategoryList")),
      },
      {
        title: "Expenses",
        name: "accounts.expenses",
        path: "/expenses",
        icon: "Receipt",
        element: lazy(() => import("@/pages/protected/accounts/ExpenseList")),
      },
    ],
  },
  {
    title: "Payments",
    icon: "Wallet",
    name: "payments",
    children: [
      {
        title: "Payment List",
        name: "payments.list",
        icon: "List",
        path: "/payments/list",
        element: lazy(() => import("@/pages/protected/payments/PaymentList")),
      },
      {
        title: "Add Payment",
        name: "payments.add",
        icon: "Plus",
        path: "/payments/add",
        element: lazy(() => import("@/pages/protected/payments/AddPayment")),
      },
      {
        title: "Edit Payment",
        name: "payments.edit",
        path: "/payments/edit/:id",
        hidden: true,
        element: lazy(() => import("@/pages/protected/payments/EditPayment")),
      },
    ],
  },
  {
    title: "Receipts",
    icon: "ReceiptText",
    name: "receipts",
    children: [
      {
        title: "Receipt List",
        name: "receipts.list",
        icon: "List",
        path: "/receipts/list",
        element: lazy(() => import("@/pages/protected/receipts/ReceiptList")),
      },
      {
        title: "Add Receipt",
        name: "receipts.add",
        icon: "Plus",
        path: "/receipts/add",
        element: lazy(() => import("@/pages/protected/receipts/AddReceipt")),
      },
      {
        title: "Edit Receipt",
        name: "receipts.edit",
        path: "/receipts/edit/:id",
        hidden: true,
        element: lazy(() => import("@/pages/protected/receipts/EditReceipt")),
      },
    ],
  },
  {
    title: "Settings",
    icon: "Settings",
    name: "settings",
    path: "/settings",
    element: lazy(() => import("@/pages/protected/settings/SettingsConfig")),
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
      },
    ],
  },
];
