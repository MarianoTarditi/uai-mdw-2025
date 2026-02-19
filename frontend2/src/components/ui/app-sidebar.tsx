"use client";

import * as React from "react";
import {
  User,
  Dumbbell,
  LayoutDashboard,
  ListCheck,
  UserRoundCog 
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

  const STATIC_BASE_URL = import.meta.env.VITE_STATIC_URL;

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;

    return `${STATIC_BASE_URL}${imagePath}?t=${Date.now()}`;
  };

  const GymLogo = () => (
    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
       <img 
         src="/Logo.png" 
         alt="Logo" 
         className="size-6 object-contain" 
       />
    </div>
  );

  const data = {
    user: {
      name: profile?.name ?? "Unknown",
      email: profile?.email ?? "No email",
      avatar: profile?.profileImage
        ? getImageUrl(profile.profileImage)
        : "/UserDefault.png",
    },
   teams: 
      {
        name: "AgustinTurriEDF",
        logo: GymLogo,
        plan: "Entrenador de fuerza",
      },
   
    navMain: [
      {
        title: "Dashboard",
        url: "/Dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Usuarios",
        url: "/GetAllUsers",
        icon: User,
      },
      {
        title: "Ejercicios",
        url: "/Exercises",
        icon: Dumbbell,
      },
      {
        title: "Rutinas",
        url: "/GetAllRoutines",
        icon: ListCheck,
      },
    ],

    projects: [
     
            {
        name: "Perfil",
        url: "/UserProfile",
        icon: UserRoundCog,
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
