import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IExercise } from "@/types/auth";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/spinner/Spinner"; 
import { reset, getExercise } from "@/features/exercises/exerciseSlice";

interface DetailExerciseProps {
  exercise: IExercise | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DetailExercise({
  exercise,
  isOpen,
  setIsOpen,
}: DetailExerciseProps) {
  const dispatch = useAppDispatch();
  const {
    isError,
    message,
    isFetchingLoading,
    exercise: detailedExercise,
  } = useAppSelector((state) => state.exercise);

  useEffect(() => {
    if (isOpen && exercise?._id) {
      dispatch(getExercise(exercise._id));
    }

    if (isError && isOpen) {
      toast.error(message || "Failed to fetch exercise details");
      dispatch(reset());
    }
  }, [isOpen, exercise?._id, dispatch, isError, message]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dispatch(reset());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:max-w-[425px] bg-background text-foreground">
        <div>
          <DialogHeader className="mb-4">
            <DialogTitle>Exercise Details</DialogTitle>
            <DialogDescription>
              Viewing the details for this exercise.
            </DialogDescription>
          </DialogHeader>
          {isFetchingLoading ? (
            <SpinnerButton/>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  readOnly
                  defaultValue={detailedExercise?.name}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="muscleGroup-1">Muscle Group</Label>
                <Input
                  id="muscleGroup-1"
                  readOnly
                  defaultValue={detailedExercise?.muscleGroup}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description-1">Description</Label>
                <Input
                  id="description-1"
                  readOnly
                  defaultValue={detailedExercise?.description}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="image-1">Image</Label>
                <Input
                  id="image-1"
                  readOnly
                  defaultValue={detailedExercise?.imageUrl}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="video-1">Video</Label>
                <Input
                  id="video-1"
                  readOnly
                  defaultValue={detailedExercise?.videoUrl}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
