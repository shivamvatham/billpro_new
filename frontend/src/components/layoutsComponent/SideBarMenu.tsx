import { ChevronRight, LayoutDashboard, List, UserRoundPlus, UserRoundPen, UsersRound, type LucideIcon } from "lucide-react"
import { protectedRoute } from "@/app/routes/config"
import React from "react"

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  UsersRound,
  List,
  UserRoundPlus,
  UserRoundPen,
}

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { NavLink } from "react-router"

export function SideBarMenu() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Welocome To Bill Pro</SidebarGroupLabel>
      <SidebarMenu>
        {protectedRoute.map((item) => (
          item.children ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive ? item.isActive : false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && iconMap[item.icon] && React.createElement(iconMap[item.icon])}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children?.map((subItem) => (
                      subItem.path && !subItem.hidden &&(
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={subItem.path}>
                              {subItem.icon && iconMap[subItem.icon] && React.createElement(iconMap[subItem.icon])}
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            item.path && !item.hidden && (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <NavLink to={item.path}>
                    {item.icon && iconMap[item.icon] && React.createElement(iconMap[item.icon])}
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
