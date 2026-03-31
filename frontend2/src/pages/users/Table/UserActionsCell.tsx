"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  CheckCircle,
  UserCog,
} from "lucide-react";

import { type IUserProfile } from "@/features/users/userSlice";
import { DetailUser } from "@/pages/users/components/DetailUser";
import { DeleteUser } from "@/pages/users/components/DeleteUser";
import { UpdateUser } from "@/pages/users/components/UpdateUser";
import { ActivateUser } from "@/pages/users/components/ActivateUser";
import { SetUserRole } from "@/pages/users/components/SetUserRole";
import { useAppSelector } from "@/app/reduxHooks"; 
import { UserRole } from "@/features/users/userSlice";

interface UserActionsProps {
  user: IUserProfile;
}

export function UserActionsCell({ user }: UserActionsProps) {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isActivateOpen, setIsActivateOpen] = React.useState(false);
  const [isRoleOpen, SetIsRoleOpen] = React.useState(false);

  const { profile } = useAppSelector((state) => state.user);
  const isAdmin = profile?.roles.includes(UserRole.Admin);
  const isTrainer = profile?.roles.includes(UserRole.Trainer);
  const canManageUsers = Boolean(isAdmin || isTrainer);


  const isOwnProfile = profile?._id === user._id;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsDetailOpen(true);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!user.isActive || (!canManageUsers && !isOwnProfile)}
            onSelect={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar usuario
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={!user.isActive || !canManageUsers || isOwnProfile}
            onSelect={(e) => {
              e.preventDefault();
              SetIsRoleOpen(true);
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Cambiar rol
          </DropdownMenuItem>

          {user.isActive ? (
            <DropdownMenuItem
              disabled={!canManageUsers || isOwnProfile} 
              onSelect={(e) => {
                e.preventDefault();
                setIsDeleteOpen(true);
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Desactivar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={!canManageUsers} 
              onSelect={(e) => {
                e.preventDefault();
                setIsActivateOpen(true);
              }}
              className="text-green-600 focus:text-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailUser
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        user={user}
      />

      <UpdateUser isOpen={isEditOpen} setIsOpen={setIsEditOpen} user={user} />

      {isDeleteOpen && user && (
        <DeleteUser
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          user={user}
        />
      )}
      {isActivateOpen && user && (
        <ActivateUser
          isOpen={isActivateOpen}
          setIsOpen={setIsActivateOpen}
          user={user}
        />
      )}

      {isRoleOpen && user && (
        <SetUserRole
          isOpen={isRoleOpen}
          setIsOpen={SetIsRoleOpen}
          user={user}
        />
      )}
    </>
  );
}
