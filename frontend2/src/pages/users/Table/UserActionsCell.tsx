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
import { MoreHorizontal, Eye, Pencil, Trash, CheckCircle } from "lucide-react";

import type { IUserProfile } from "@/features/users/userSlice";
import { DetailUser } from "@/pages/users/components/DetailUser";
import { DeleteUser } from "@/pages/users/components/DeleteUser";
import { UpdateUser } from "@/pages/users/components/UpdateUser";
import { ActivateUser } from "@/pages/users/components/ActivateUser";

interface UserActionsProps {
  user: IUserProfile;
}

export function UserActionsCell({ user }: UserActionsProps) {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isActivateOpen, setIsActivateOpen] = React.useState(false);

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
            Ver Detalle
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!user.isActive}
            onSelect={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {user.isActive ? (
            <DropdownMenuItem
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
    </>
  );
}
