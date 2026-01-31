"use client";

import { Input } from "@/components/ui/input";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import { ExerciseTable } from "./Table/ExerciseTable";
import { useExerciseTable } from "./Table/useExerciseTable";
import { ExerciseButton } from "./Table/ExerciseButton";
import { DataTableViewOptions } from "../../components/exercises/table/DataTableViewOptions";
import { useEffect } from "react";

export function GetAllExercises() {
  const dispatch = useAppDispatch();
  const { exercises, isFetchingLoading } = useAppSelector(
    (state) => state.exercise
  );

  useEffect(() => {
    dispatch(getAllExercises());
  }, [dispatch]);

  const { table } = useExerciseTable(exercises);

  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
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
