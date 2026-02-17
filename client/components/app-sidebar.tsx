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


const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dasboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: FileText,
    },
    {
      title: "AI Insights",
      url: "/ai-insights",
      icon: Brain,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: UserRound,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar className="bg-white" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="cursor-pointer lg:block hidden">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
