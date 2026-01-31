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
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";

import type { IUserProfile } from "@/features/users/userSlice";
import { DetailUser } from "@/components/users/DetailUser";
import { DeleteUser } from "@/components/users/DeleteUser";
import { UpdateUser } from "@/components/users/UpdateUser";

interface UserActionsProps {
  user: IUserProfile;
}

export function UserActionsCell({ user }: UserActionsProps) {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

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

          {/* VER DETALLE */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsDetailOpen(true);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>

          {/* EDITAR */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsEditOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* ELIMINAR */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteOpen(true);
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* MODAL DETALLE */}
      <DetailUser
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        user={user}
      />

      {/* MODAL EDITAR */}
      <UpdateUser isOpen={isEditOpen} setIsOpen={setIsEditOpen} user={user} />

      {/* MODAL ELIMINAR */}
      {isDeleteOpen &&
        user && ( // <--- Importante el user &&
          <DeleteUser
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            user={user}
          />
        )}
    </>
  );
}
