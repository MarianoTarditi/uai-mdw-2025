"use client";

import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllExercises, reset } from "@/features/exercises/exerciseSlice";
import { ExerciseTable } from "./Table/ExerciseTable";
import { useExerciseTable } from "./Table/useExerciseTable";
import { ExerciseButton } from "./Table/ExerciseButton";
import { DataTableViewOptions } from "../../components/private/table/DataTableViewOptions";
import { useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { PageHero } from "@/components/private/premium/PageHero";
import { PremiumTableShell } from "@/components/private/premium/PremiumTableShell";
import { PremiumErrorState } from "@/components/private/premium/PremiumErrorState";

export function GetAllExercises() {
  const dispatch = useAppDispatch();

  const { exercises, isFetchingLoading, isDeletingSuccess, isError } =
    useAppSelector((state) => state.exercise);

  useEffect(() => {
    if (exercises.length > 0) return;
    dispatch(getAllExercises());
  }, [dispatch, exercises.length]);

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
      <PremiumErrorState
        title="Acceso denegado"
        description='No tienes los permisos necesarios para acceder a la sección de "Ejercicios".'
        tone="forbidden"
        fullScreen
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      <PageHero
        icon={Dumbbell}
        title="Biblioteca de Ejercicios"
        description="Gestiona el catalogo tecnico por grupo muscular, objetivo y equipamiento para acelerar la prescripcion diaria."
        badge={`${exercises.length} ejercicios`}
        chips={["Precision Tecnica", "Carga Inteligente", "Base Escalable"]}
      />

      <PremiumTableShell
        searchPlaceholder="Buscar ejercicio por nombre..."
        searchValue={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
        onSearchChange={(value) => table.getColumn("nombre")?.setFilterValue(value)}
        actions={
          <>
            <ExerciseButton />
            <DataTableViewOptions table={table} />
          </>
        }
      >
        <ExerciseTable table={table} />
      </PremiumTableShell>
    </div>
  );
}
