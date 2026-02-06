import { isAuthenticated } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function PublicRoutes() {
  const token = useSelector(isAuthenticated)

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
