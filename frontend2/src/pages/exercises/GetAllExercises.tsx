"use client";

import { Input } from "@/components/ui/input";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
// 👇 Importamos reset
import { getAllExercises, reset } from "@/features/exercises/exerciseSlice";
import { ExerciseTable } from "./table/ExerciseTable";
import { useExerciseTable } from "./table/useExerciseTable";
import { ExerciseButton } from "./table/ExerciseButton";
import { DataTableViewOptions } from "../../components/private/table/DataTableViewOptions";
import { useEffect } from "react";

export function GetAllExercises() {
  const dispatch = useAppDispatch();

  // 👇 Traemos isDeletingSuccess del estado
  const { exercises, isFetchingLoading, isDeletingSuccess } = useAppSelector(
    (state) => state.exercise,
  );

  // 1. Carga inicial
  useEffect(() => {
    dispatch(getAllExercises());
  }, [dispatch]);

  // 2. NUEVO: Escuchar cambios en la eliminación
  useEffect(() => {
    if (isDeletingSuccess) {
      // a) Volvemos a pedir los datos al servidor para asegurar que la tabla esté al día
      dispatch(getAllExercises());

      // b) Inmediatamente reseteamos las banderas (success, loading, etc.)
      // Esto evita bucles infinitos y prepara el estado para la próxima acción
      dispatch(reset());
    }
  }, [isDeletingSuccess, dispatch]);

  const { table } = useExerciseTable(exercises);

  // Opcional: Puedes mostrar el spinner también si se está borrando para evitar interacciones
  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* ... resto de tu código igual ... */}
        <Input
          placeholder="Filter by nombre..."
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
