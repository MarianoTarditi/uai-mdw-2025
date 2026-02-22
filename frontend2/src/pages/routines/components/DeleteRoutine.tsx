"use client";

import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { deleteRoutine } from "@/features/routines/routineSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SpinnerButton } from "@/components/private/spinner/Spinner";

interface DeleteRoutineProps {
  routine: {
    _id: string;
    name: string;
  };
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DeleteRoutine({
  routine,
  isOpen,
  setIsOpen,
}: DeleteRoutineProps) {
  const dispatch = useAppDispatch();

  const { isDeletingLoading } = useAppSelector((state) => state.routine);

  const handleDelete = async () => {
    if (!routine._id) return;

    try {
      await dispatch(deleteRoutine(routine._id)).unwrap();
      toast.success("Rutina eliminada exitosamente!");
      setIsOpen(false);
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "An unexpected error occurred",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar rutina</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          ¿Estás seguro de que deseas eliminar la rutina
          <span className="font-medium">{routine.name}</span>? Esta acción no se
          puede deshacer.
        </p>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeletingLoading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeletingLoading}
          >
            {isDeletingLoading ? <SpinnerButton variant="sizes" /> : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
