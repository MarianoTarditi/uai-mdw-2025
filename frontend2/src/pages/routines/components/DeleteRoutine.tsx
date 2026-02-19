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

  const { isActionLoading } = useAppSelector(
    (state) => state.routine
  );

  const handleDelete = async () => {
    if (!routine._id) return;

    try {
      await dispatch(deleteRoutine(routine._id)).unwrap();
      toast.success("Routine deleted successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "An unexpected error occurred"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete routine</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium">{routine.name}</span>?  
          This action cannot be undone.
        </p>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isActionLoading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isActionLoading}
          >
            {isActionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
