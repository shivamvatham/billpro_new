import { Navigate, Outlet } from "react-router";

export default function ProtectedRoutes() {
  const token = true;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
