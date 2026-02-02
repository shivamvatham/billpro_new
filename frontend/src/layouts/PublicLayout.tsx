import { Outlet } from "react-router"

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
    </div>
  )
}
