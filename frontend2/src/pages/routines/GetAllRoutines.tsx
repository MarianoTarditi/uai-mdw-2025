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

export function GetAllRoutines() {
  const dispatch = useAppDispatch();

  const { routines, isLoading } = useAppSelector((state) => state.routine);

  useEffect(() => {
    dispatch(fetchRoutines());
  }, [dispatch]);

  const { table } = useRoutineTable(routines);

  if (isLoading && routines.length === 0) {
    return <SpinnerButton variant="sizes" />;
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
