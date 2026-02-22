import { TriangleAlertIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { IExercise } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { deleteExercise } from "../../../features/exercises/exerciseSlice";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";

interface DeleteExerciseProps {
  exercise: IExercise;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DeleteExercise({
  exercise,
  isOpen,
  setIsOpen,
}: DeleteExerciseProps) {
  const dispatch = useAppDispatch();

  const { isDeletingLoading } = useAppSelector((state) => state.exercise);

  const handleDelete = async () => {
    if (!exercise._id) return;

    try {
      const resultPayload = await dispatch(
        deleteExercise(exercise._id),
      ).unwrap();

      toast.success(
        resultPayload.routineDeleted
          ? "Exercise deleted and the routine was removed because it had no exercises left"
          : "Ejercicio eliminado exitosamente!",
      );

      setIsOpen(false);
    } catch (error: unknown) {
      toast.error(
        typeof error === "string" ? error : "Failed to delete exercise",
      );
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ">
            <TriangleAlertIcon className="text-destructive w-6 h-6" />
          </div>
          <AlertDialogTitle className="bg-background text-foreground">
            ¿Estás seguro de que deseas eliminar este ejercicio??
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Esta acción no se puede deshacer. Eliminará el ejercicio
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-background text-foreground"
            disabled={isDeletingLoading}
          >
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/80"
            onClick={handleDelete}
            disabled={isDeletingLoading}
          >
            {isDeletingLoading ? <SpinnerButton variant="sizes" /> : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
