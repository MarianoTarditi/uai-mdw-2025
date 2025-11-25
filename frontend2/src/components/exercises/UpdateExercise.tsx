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
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema } from "@/zodValidations/exerciseSchema";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/spinner/Spinner"; 
import { reset, updateExercise } from "@/features/exercises/exerciseSlice";

interface UpdateExerciseProps {
  exercise: IExercise | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function UpdateExercise({
  exercise,
  isOpen,
  setIsOpen,
}: UpdateExerciseProps) {
  const dispatch = useAppDispatch();
  const { isError, isUpdatingSuccess, message, isUpdatingLoading } =
    useAppSelector((state) => state.exercise);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IExercise>({
    resolver: zodResolver(exerciseSchema),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    } 

    if (isUpdatingSuccess && isOpen) {
      toast.success("Exercise updated successfully!");
      dispatch(reset());
      setIsOpen(false);
    } 
  }, [isError, isUpdatingSuccess, message, dispatch, setIsOpen, isOpen]);

  const handleFormSubmit = async (data: IExercise) => {
    if (!exercise?._id) return;
    
    await dispatch(updateExercise({ id: exercise._id, exerciseData: data }));
  };

  if (isUpdatingLoading) {
    return (
      <SpinnerButton variant="sizes" />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:max-w-[425px] bg-background text-foreground">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Make changes to your exercise and save when you’re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                {...register("name")}
                defaultValue={exercise?.name}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="muscleGroup-1">Muscle Group</Label>
              <Input
                id="muscleGroup-1"
                {...register("muscleGroup")}
                defaultValue={exercise?.muscleGroup}
              />
              {errors.muscleGroup && (
                <p className="text-sm text-red-500">
                  {" "}
                  {errors.muscleGroup.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description-1">Description</Label>
              <Input
                id="description-1"
                {...register("description")}
                defaultValue={exercise?.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="image-1">Image</Label>
              <Input
                id="image-1"
                {...register("imageUrl")}
                defaultValue={exercise?.imageUrl}
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500">
                  {errors.imageUrl?.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="video-1">Video</Label>
              <Input
                id="video-1"
                {...register("videoUrl")}
                defaultValue={exercise?.videoUrl}
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-500">
                  {errors.videoUrl?.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
