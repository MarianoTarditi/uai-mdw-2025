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
import { deleteExercise, reset } from "@/features/exercises/exerciseSlice";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { useEffect } from "react";

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
  const { isError, isDeletingSuccess, isDeletingLoading, message } =
    useAppSelector((state) => state.exercise);

  useEffect(() => {
    if (isError && isOpen) {
      toast.error(message || "An unexpected error occurred");
      dispatch(reset());
    }

    if (isDeletingSuccess) {
      toast.success("Exercise deleted successfully!");
      dispatch(reset()); 
    }
  }, [isError, isDeletingSuccess, message, dispatch, isOpen, setIsOpen]);

  const handleDelete = () => {
    if (!exercise._id) return;

    dispatch(deleteExercise(exercise._id));
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ">
            <TriangleAlertIcon className="text-destructive w-6 h-6" />
          </div>
          <AlertDialogTitle className="bg-background text-foreground">
            Are you absolutely sure you want to delete this exercise?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete the
            exercise.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-background text-foreground">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/80"
            onClick={handleDelete}
            disabled={isDeletingLoading}
          >
            {isDeletingLoading ? <SpinnerButton variant="sizes" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
