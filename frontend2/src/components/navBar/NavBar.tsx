"use client";

import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { Link } from "react-router-dom"; // Asumimos que estás usando react-router-dom
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/themeProvider/ThemeProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";
// Importar el componente Avatar reutilizable
import { UserAvatar } from "../userAvatar/UserAvatar";
import { useAppSelector } from "@/app/reduxHooks";

const Navbar = () => {
  const { profile } = useAppSelector((state) => state.user);
  const { setTheme } = useTheme(); // Definir el tamaño estándar del avatar para la barra de navegación

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-10 border-b">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        {/* Enlace al Dashboard, aunque está vacío en tu código original */}
        <Link to="/dashboard" aria-label="Dashboard"></Link>
        {/* 1. Menú de Tema (sin cambios) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Usamos Button para mejor accesibilidad y hover state */}
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
            >
              <UserAvatar
                imagePath={
                  profile?.profileImage
                    ? `${profile.profileImage}?t=${Date.now()}`
                    : undefined
                }
                name={profile?.name ?? "U"}
                lastName={profile?.lastName ?? "A"}
                className="w-8 h-8" // Usar el tamaño estándar
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuLabel>
              {profile?.name} {profile?.lastName}
              <p className="text-xs font-normal text-muted-foreground">
                {profile?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center">
                <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-white focus:bg-red-600">
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
