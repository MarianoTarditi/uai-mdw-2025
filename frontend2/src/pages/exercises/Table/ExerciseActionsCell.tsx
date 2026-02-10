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

import { DetailExercise } from "@/pages/exercises/components/DetailExercise";
import { UpdateExercise } from "@/pages/exercises/components/UpdateExercise";
import { DeleteExercise } from "@/pages/exercises/components/DeleteExercise";

import type { IExercise } from "@/types/auth";

export function ExerciseActionsCell({ exercise }: { exercise: IExercise }) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
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
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailExercise
        isOpen={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        exercise={exercise}
      />
      <UpdateExercise
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        exercise={exercise}
      />
      <DeleteExercise
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        exercise={exercise}
      />
    </>
  );
}
