"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import {
  reset,
  createExercise,
} from "@/features/exercises/exerciseSlice";
import { exerciseSchema } from "@/zodValidations/exerciseSchema";
import type { IExercise } from "@/types/auth";
import { Loader, Center } from "@mantine/core";
import { useEffect } from "react";

interface CreateExerciseProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: IExercise) => void; // callback cuando se envía el formulario
}

export function AddExercise({
  isOpen,
  setIsOpen,
}: CreateExerciseProps) {
  const dispatch = useAppDispatch();
  const { isError, isCreatingSuccess, message, isCreatingLoading } = useAppSelector(
    (state) => state.exercise
  );

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

    if (isCreatingSuccess) {
      toast.success("Exercise created successfully!");
      dispatch(reset());
      setIsOpen(false); // cerrar modal aquí
    }
  }, [isError, isCreatingSuccess, message, dispatch, setIsOpen]);

  const handleFormSubmit = async (data: IExercise) => {
    await dispatch(createExercise(data));
  };

  if (isCreatingLoading) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader color="rgba(0, 0, 0, 0.87)" size="sm" type="dots" />
      </Center>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:max-w-[425px] bg-background text-foreground">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Add Exercise</DialogTitle>
            <DialogDescription>
              Enter the details of the new exercise and save when you’re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter exercise name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="muscleGroup">Muscle Group</Label>
              <Input
                id="muscleGroup"
                {...register("muscleGroup")}
                placeholder="e.g. Chest, Legs..."
              />
              {errors.muscleGroup && (
                <p className="text-sm text-red-500">
                  {errors.muscleGroup.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe the exercise"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Exercise</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
