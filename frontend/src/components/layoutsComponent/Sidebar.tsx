import * as React from "react"
import {
  GalleryVerticalEnd,
} from "lucide-react"

import { SideBarMenu } from './SideBarMenu'
import { SideBarFooter } from './SideBarFooter'
import { SideBarHeader } from './SideBarHeader'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useSelector } from "react-redux"
import { getCredentialsSelect } from "@/features/auth/authSlice"

// This is sample data.
const data = {
  user:
  {
    name: "Bill Pro Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
    email: "billpro@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useSelector(getCredentialsSelect)
  console.log(userData.user)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SideBarHeader header={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SideBarMenu />
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter user={{
          name:userData.user.name || '',
          email: userData.user.email || ''
          }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
