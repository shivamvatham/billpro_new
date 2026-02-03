"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Separator } from "../ui/separator"

export function SideBarHeader({
  header,
}: {
  header: {
    name: string
    logo: React.ElementType
    plan: string
  }
}) {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <header.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{header.name}</span>
              <span className="truncate text-xs">{header.plan}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <Separator />
    </>
  )
}
