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
import { ArrowUpDown, AlertCircle } from "lucide-react"; // Agregué icono de alerta
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RoutineActionsCell } from "./RoutineActionsCell";
import type { IRoutine } from "../../../features/routines/routineTypes";

export function useRoutineTable(routines: IRoutine[]) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

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
            Nombre Rutina <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },

      {
        accessorKey: "exerciseAssignments",
        header: "Ejercicios",
        cell: ({ row }) => {
          // 1. Obtenemos el array de asignaciones
          const exercises = row.original.exerciseAssignments;

          // 2. Validación básica de array
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
                // 3. LÓGICA DE PROTECCIÓN (Defensive Programming)

                // Extraemos la info del ejercicio
                const exInfo = ea.exerciseId;

                // Verificamos si es un objeto válido (Populado)
                const isPopulated = exInfo && typeof exInfo === "object";

                // Obtenemos el nombre de forma segura (soportando 'name' o 'nombre')
                const exerciseName = isPopulated
                  ? (exInfo as any).nombre ||
                    (exInfo as any).name ||
                    "Sin nombre"
                  : null;

                // Definimos el estado visual
                if (!exInfo) {
                  // Caso: Ejercicio eliminado de la BD (es null)
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
                  // Caso: Solo tenemos el ID (string), no se hizo populate
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

                // Caso: Todo OK
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
    [],
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
