// components/exercises/table/useExerciseTable.ts

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
// 1. IMPORTAR BADGE
import { Badge } from "@/components/ui/badge"; 
import { ExerciseActionsCell } from "./ExerciseActionsCell";
import type { IExercise } from "@/types/auth";

export function useExerciseTable(exercises: IExercise[]) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

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
            Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      // 2. COLUMNA MODIFICADA CON BADGES
      {
        accessorKey: "musculosPrincipales",
        header: "Músculos principales",
        cell: ({ row }) => {
          // Obtenemos el valor (debería ser un array de strings)
          const musculos = row.getValue("musculosPrincipales") as string[];

          // Validación por si viene vacío o null
          if (!musculos || musculos.length === 0) {
            return <span className="text-muted-foreground text-xs">N/A</span>;
          }

          // Renderizamos los Badges
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
        accessorKey: "comentario",
        header: "Comentario",
        cell: ({ row }) => {
            const text = row.getValue("comentario") as string;
            return <div className="max-w-[200px] truncate" title={text}>{text}</div>
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ExerciseActionsCell exercise={row.original} />,
      },
    ],
    []
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