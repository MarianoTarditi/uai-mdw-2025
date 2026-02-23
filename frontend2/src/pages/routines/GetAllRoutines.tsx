"use client";

import { Input } from "@/components/ui/input";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { fetchRoutines } from "@/features/routines/routineSlice";
import { RoutineTable } from "./table/RoutineTable";
import { useRoutineTable } from "./table/useRoutineTable";
import { RoutineButton } from "./table/RoutineButton";
import { DataTableViewOptions } from "@/components/private/table/DataTableViewOptions";
import { useEffect } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GetAllRoutines() {
  const dispatch = useAppDispatch();

  const { routines, isFetchingLoading, isError, message } = useAppSelector(
    (state) => state.routine,
  );

  useEffect(() => {
    dispatch(fetchRoutines());
  }, [dispatch]);

  const { table } = useRoutineTable(routines);

  const isForbidden =
    isError &&
    (message?.toLowerCase().includes("permisos") ||
      message?.toLowerCase().includes("forbidden") ||
      message?.toLowerCase().includes("403"));

  if (isFetchingLoading && routines.length === 0) {
    return <SpinnerButton variant="sizes" />;
  }

  if (isError) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center bg-background">
        <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl text-center">
          <div className="mb-5 flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${isForbidden ? "bg-destructive/10" : "bg-muted"}`}
            >
              <Lock
                className={`h-8 w-8 ${isForbidden ? "text-destructive" : "text-muted-foreground"}`}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">
            {isForbidden ? "Acceso denegado" : "Ops! Algo salió mal"}
          </h2>

          <p className="text-sm text-muted-foreground">
            {isForbidden
              ? 'No tienes los permisos necesarios para acceder a la sección de "Rutinas".'
              : message || "No se pudieron cargar las rutinas en este momento."}
          </p>

          {!isForbidden && (
            <Button
              variant="outline"
              mt="md"
              onClick={() => dispatch(fetchRoutines())}
              className="mt-4"
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre de rutina..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <div className="ml-auto flex items-center space-x-2">
          <RoutineButton />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <RoutineTable table={table} />
    </div>
  );
}
