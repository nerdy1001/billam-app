"use client"

import * as React from "react"
import {
  AudioWaveform,
  Brain,
  Command,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { Separator } from "./ui/separator"
import { useParams, usePathname } from "next/navigation"
import { dashboardRoutes } from "@/lib/routes"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const params = useParams();
  const pathName = usePathname();
  const accountId = params.id as string;

  const navMain = [
    {
      title: "Dashboard",
      url: dashboardRoutes.base(accountId),
      icon: LayoutDashboard,
      isActive: pathName === dashboardRoutes.base(accountId)
    },
    {
      title: "Invoices",
      url: dashboardRoutes.invoices(accountId),
      icon: FileText,
      isActive: pathName === dashboardRoutes.invoices(accountId)
    },
    {
      title: "Insights",
      url: dashboardRoutes.aiInsights(accountId),
      icon: Brain,
      isActive: pathName === dashboardRoutes.aiInsights(accountId)
    },
    {
      title: "Clients",
      url: dashboardRoutes.clients(accountId),
      icon: UserRound,
      isActive: pathName === dashboardRoutes.clients(accountId)
    },
    {
      title: "Settings",
      url: dashboardRoutes.invoices(accountId),
      icon: Settings,
      isActive: pathName === dashboardRoutes.settings(accountId)
    },
  ]

  return (
    <Sidebar className="bg-white" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter className="cursor-pointer lg:block hidden">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
