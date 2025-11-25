"use client";

import * as React from "react";
import { Bot, Frame, GalleryVerticalEnd, Map, Settings2 } from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavProjects } from "@/components/ui/nav-projects";
import { NavUser } from "@/components/ui/nav-user";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/app/reduxHooks";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppSelector((state) => state.user);

  const data = {
    user: {
      name: profile?.name ?? "Unknown",
      email: profile?.email ?? "No email",
      avatar: profile?.profileImage ?? "/default-avatar.png",
    },
    teams: [
      {
        name: "AgustinTurriEF",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Dashboard",
            url: "/Dashboard",
          },
        ],
      },
      {
        title: "Clients",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Clients",
            url: "#",
          },
          {
            title: "Exercises",
            url: "#",
          },
          {
            title: "Routines",
            url: "#",
          },
          {
            title: "Progress",
            url: "#",
          },
        ],
      },
      {
        title: "Routines",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Exercises",
            url: "/Exercises",
          },
          {
            title: "Routines",
            url: "#",
          },
          {
            title: "Progress",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Adjustmentments",
        url: "#",
        icon: Frame,
      },
      {
        name: "FAQ",
        url: "#",
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
