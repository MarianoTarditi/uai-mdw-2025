// components/exercises/table/ExerciseActionsCell.tsx

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
import { MoreHorizontal } from "lucide-react";

import { DetailExercise } from "@/components/exercises/DetailExercise";
import { UpdateExercise } from "@/components/exercises/UpdateExercise";
import { DeleteExercise } from "@/components/exercises/DeleteExercise";

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
            View Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            Delete
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
