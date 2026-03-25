"use client";

import * as React from "react";
import {
  User,
  Dumbbell,
  LayoutDashboard,
  ListCheck,
  UserRoundCog,
  Wallet,
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
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { UserRole } from "@/features/users/userSlice";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAppSelector((state) => state.user);
  const roles = profile?.roles ?? [];
  const isAdmin = roles.includes(UserRole.Admin);
  const isTrainer = roles.includes(UserRole.Trainer);
  const isStudent = roles.includes(UserRole.Student);

  const canSeeDashboard = isAdmin;
  const canSeeUsers = isAdmin;
  const canSeePayments = isTrainer;
  const canSeeProfile = isAdmin || isTrainer || isStudent;
  const canSeeExercises = isAdmin || isTrainer || isStudent;
  const canSeeRoutines = isAdmin || isTrainer || isStudent;

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
        ? resolveMediaUrl(profile.profileImage)
        : "/UserDefault.png",
    },
    teams: [
      {
        name: "AgustinTurriEDF",
        logo: GymLogo,
        plan: "High-Performance Coaching",
      },
    ],
    navMain: [
      ...(canSeeDashboard
        ? [
            {
              title: "Dashboard",
              url: "/Dashboard",
              icon: LayoutDashboard,
            },
          ]
        : []),
      ...(canSeeUsers
        ? [
            {
              title: "Usuarios",
              url: "/GetAllUsers",
              icon: User,
            },
          ]
        : []),
      ...(canSeePayments
        ? [
            {
              title: "Pagos",
              url: "/Payments",
              icon: Wallet,
            },
          ]
        : []),
      ...(canSeeExercises
        ? [
            {
              title: "Ejercicios",
              url: "/Exercises",
              icon: Dumbbell,
            },
          ]
        : []),
      ...(canSeeRoutines
        ? [
            {
              title: "Rutinas",
              url: "/GetAllRoutines",
              icon: ListCheck,
            },
          ]
        : []),
    ],

    projects: canSeeProfile
      ? [
          {
        name: "Perfil",
        url: "/UserProfile",
        icon: UserRoundCog,
      },
        ]
      : [],
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
