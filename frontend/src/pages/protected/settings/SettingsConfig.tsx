import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Settings2 } from "lucide-react"
import { useNavigate, useLocation, Outlet } from "react-router"
import { useEffect } from "react"

export default function SettingsConfig() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = location.pathname.split('/')[2] || 'general'

  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/general', { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <Tabs value={currentTab} onValueChange={(v) => navigate(`/settings/${v}`)}>
      <TabsList variant="line">
        <TabsTrigger value="general">
          <Settings2 />
          General Settings
        </TabsTrigger>
        <TabsTrigger value="portal">
          <Building2 />
          Portal Settings
        </TabsTrigger>
      </TabsList>
      <Outlet />
    </Tabs>
  )
}
