// components/exercises/table/useExerciseTable.ts

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
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ExerciseActionsCell } from "./ExerciseActionsCell";
import type { IExercise } from "@/types/auth";

export function useExerciseTable(exercises: IExercise[]) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const columns = React.useMemo<ColumnDef<IExercise>[]>(
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
        accessorKey: "nombre",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre Ejercicio <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        // 👇 Agregamos la propiedad cell para aplicar el estilo
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("nombre")}</div>
        ),
      },
      {
        accessorKey: "musculosPrincipales",
        header: "Músculos principales",
        cell: ({ row }) => {
          const musculos = row.getValue("musculosPrincipales") as string[];

          if (!musculos || musculos.length === 0) {
            return <span className="text-muted-foreground text-xs">N/A</span>;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {musculos.map((musculo, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {musculo}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "musculosSecundarios",
        header: "Músculos secundarios",
        cell: ({ row }) => {
          const musculos = row.getValue("musculosSecundarios") as string[];

          if (!musculos || musculos.length === 0) {
            return <span className="text-muted-foreground text-xs">N/A</span>;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {musculos.map((musculo, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {musculo}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "etiquetas",
        header: "Etiquetas",
        cell: ({ row }) => {
          const etiquetas = row.getValue("etiquetas") as string[];

          if (!etiquetas || etiquetas.length === 0) {
            return <span className="text-muted-foreground text-xs">N/A</span>;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {etiquetas.map((etiquetas, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {etiquetas}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "materialesNecesarios",
        header: "Materiales Necesarios",
        cell: ({ row }) => {
          const materialesNecesarios = row.getValue(
            "materialesNecesarios",
          ) as string[];

          if (!materialesNecesarios || materialesNecesarios.length === 0) {
            return <span className="text-muted-foreground text-xs">N/A</span>;
          }

          return (
            <div className="flex flex-wrap gap-1">
              {materialesNecesarios.map((materialesNecesarios, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {materialesNecesarios}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <ExerciseActionsCell exercise={row.original} />,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: exercises,
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

  return { table, sorting, columnFilters, columnVisibility, rowSelection };
}
