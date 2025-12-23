"use client";

import { Input } from "@/components/ui/input";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import { ExerciseTable } from "./ExerciseTable";
import { useExerciseTable } from "./useExerciseTable";
import { ExerciseButton } from "./ExerciseButton";
import { DataTableViewOptions } from "../../components/exercises/table/DataTableViewOptions";
import * as React from "react";

export function GetAllExercises() {
  const dispatch = useAppDispatch();
  const { exercises, isFetchingLoading } = useAppSelector(
    (state) => state.exercise
  );

  React.useEffect(() => {
    dispatch(getAllExercises());
  }, [dispatch]);

  const { table } = useExerciseTable(exercises);

  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
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
