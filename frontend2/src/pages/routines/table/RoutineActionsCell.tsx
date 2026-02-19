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

import { UpdateRoutine } from "@/pages/routines/components/UpdateRoutine";
import { DeleteRoutine } from "@/pages/routines/components/DeleteRoutine";
import { DetailRoutine } from "@/pages/routines/components/DetailRoutine";
import type { IRoutine } from "@/features/routines/routineTypes";
import { useAppSelector } from "@/app/reduxHooks";
import { UserRole } from "@/features/users/userSlice";

export function RoutineActionsCell({ routine }: { routine: IRoutine }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const { profile } = useAppSelector((state) => state.user);
  const isTrainer = profile?.roles.includes(UserRole.Trainer);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" type="button">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailOpen(true);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!isTrainer}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={!isTrainer}
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailRoutine
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        routine={routine}
      />
      <UpdateRoutine
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        routine={routine}
      />
      <DeleteRoutine
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        routine={routine}
      />
    </>
  );
}
