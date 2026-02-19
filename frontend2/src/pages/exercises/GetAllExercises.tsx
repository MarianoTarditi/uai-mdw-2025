"use client";

import { Input } from "@/components/ui/input";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllExercises, reset } from "@/features/exercises/exerciseSlice";
import { ExerciseTable } from "./Table/ExerciseTable";
import { useExerciseTable } from "./Table/useExerciseTable";
import { ExerciseButton } from "./Table/ExerciseButton";
import { DataTableViewOptions } from "../../components/private/table/DataTableViewOptions";
import { useEffect } from "react";
import { Lock } from "lucide-react";

export function GetAllExercises() {
  const dispatch = useAppDispatch();

  const { exercises, isFetchingLoading, isDeletingSuccess, isError } =
    useAppSelector((state) => state.exercise);

  useEffect(() => {
    dispatch(getAllExercises());
  }, [dispatch]);

  useEffect(() => {
    if (isDeletingSuccess) {
      dispatch(getAllExercises());
      dispatch(reset());
    }
  }, [isDeletingSuccess, dispatch]);

  const { table } = useExerciseTable(exercises);

  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  if (isError) {
    return (
      <div className="relative flex min-h-screen items-start justify-center bg-background pt-60">
        <div className="absolute inset-0 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Acceso denegado</h2>

          <p className="text-sm text-muted-foreground">
            No tienes los permisos necesarios para acceder a la sección de
            "Ejercicios".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("nombre")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center space-x-2">
          <ExerciseButton />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <ExerciseTable table={table} />
    </div>
  );
}
