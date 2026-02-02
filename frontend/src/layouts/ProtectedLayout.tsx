import { Outlet } from "react-router"

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  )
}
