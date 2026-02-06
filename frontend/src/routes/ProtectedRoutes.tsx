import { isAuthenticated } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoutes() {
  const token = useSelector(isAuthenticated)

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
