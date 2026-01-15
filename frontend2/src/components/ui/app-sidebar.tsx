"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  CreditCard,
  User,
  Dumbbell,
  LayoutDashboard,
  ListCheck,
  CircleQuestionMark,
  Settings
} from "lucide-react";
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

  const STATIC_BASE_URL = "http://localhost:3000";

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;

    return `${STATIC_BASE_URL}${imagePath}?t=${Date.now()}`;
  };

  const data = {
    user: {
      name: profile?.name ?? "Unknown",
      email: profile?.email ?? "No email",
      avatar: profile?.profileImage
        ? getImageUrl(profile.profileImage)
        : "/default-avatar.png",
    },
    teams: [
      {
        name: "AgustinTurriEDF",
        logo: GalleryVerticalEnd,
        plan: "Entrenador de fuerza",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/Dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: "/Users",
        icon: User,
      },
      {
        title: "Exercises",
        url: "/Exercises",
        icon: Dumbbell,
      },
      {
        title: "Routines",
        url: "/Routines",
        icon: ListCheck,
      },
      {
        title: "Payments",
        url: "/Payments",
        icon: CreditCard,
      },
    ],

    projects: [
      {
        name: "FAQ",
        url: "#",
        icon: CircleQuestionMark,
      },
      {
        name: "Settings",
        url: "#",
        icon: Settings,
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
