import { Navigate, Outlet } from "react-router";

export default function PublicRoutes() {
  const token = false;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
