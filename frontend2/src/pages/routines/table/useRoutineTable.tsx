import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RoutineActionsCell } from "./RoutineActionsCell";
import type { IRoutine } from "../../../features/routines/routineTypes";
import { useAppSelector } from "@/app/reduxHooks";

export function useRoutineTable(routines: IRoutine[]) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const { profile } = useAppSelector((state) => state.user);
  const isStudent = profile?.roles?.includes("student");

  const columns = React.useMemo<ColumnDef<IRoutine>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },

      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre rutina <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },

      {
        accessorKey: isStudent ? "trainerId" : "studentId",

        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {isStudent ? "Entrenador" : "Estudiante"}{" "}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),

        cell: ({ row }) => {
          const data = isStudent
            ? row.original.trainerId
            : row.original.studentId;
          const isTemplate = row.original.isTemplate;

          if (!isStudent) {
            if (isTemplate || !data) {
              return (
                <Badge
                  variant="outline"
                  className="text-muted-foreground border-dashed"
                >
                  Plantilla
                </Badge>
              );
            }
          }

          if (typeof data === "object" && data !== null && "name" in data) {
            const { name, lastName } = data as {
              name: string;
              lastName?: string;
            };

            return (
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {name} {lastName}
                </span>
              </div>
            );
          }

          return (
            <span className="text-xs text-muted-foreground">
              {data ? String(data) : "-"}
            </span>
          );
        },
      },

      {
        accessorKey: "exerciseAssignments",
        header: "Ejercicios",
        cell: ({ row }) => {
          const exercises = row.original.exerciseAssignments;

          if (
            !exercises ||
            !Array.isArray(exercises) ||
            exercises.length === 0
          ) {
            return (
              <span className="text-muted-foreground text-xs">
                Sin ejercicios
              </span>
            );
          }

          return (
            <div className="flex flex-wrap gap-1">
              {exercises.map((ea, index) => {
                const exInfo = ea.exerciseId;
                const isPopulated = exInfo && typeof exInfo === "object";

                type PopulatedExercise = {
                  nombre?: string;
                  name?: string;
                };

                const exerciseData = exInfo as PopulatedExercise;

                const exerciseName = isPopulated
                  ? exerciseData.nombre || exerciseData.name || "Sin nombre"
                  : null;

                if (!exInfo) {
                  return (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="font-normal text-[10px] px-1"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" /> Eliminado
                    </Badge>
                  );
                }

                if (!isPopulated) {
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="font-normal text-xs text-muted-foreground"
                    >
                      Cargando...
                    </Badge>
                  );
                }

                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="font-normal"
                  >
                    {exerciseName}
                  </Badge>
                );
              })}
            </div>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Creada",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("es-AR"),
      },

      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <RoutineActionsCell routine={row.original} />,
      },
    ],
    [isStudent],
  );

  const table = useReactTable({
    data: routines,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table };
}
