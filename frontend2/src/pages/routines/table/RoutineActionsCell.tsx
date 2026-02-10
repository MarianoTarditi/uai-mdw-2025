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

export function RoutineActionsCell({ routine }: { routine: IRoutine }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* 1. IMPORTANTE: Agregamos type="button" para que no envíe formularios accidentalmente */}
          <Button variant="ghost" className="h-8 w-8 p-0" type="button">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* 2. Usamos onClick en lugar de onSelect */}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation(); // ⛔ Detiene la propagación del click hacia filas o formularios padres
              setIsDetailOpen(true);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </DropdownMenuItem>

          <DropdownMenuItem 
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

      {/* MODALES - Se renderizan fuera del DropdownMenu para evitar problemas de foco (Pointer Events) */}
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