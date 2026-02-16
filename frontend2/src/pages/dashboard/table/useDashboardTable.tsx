import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { type IAuditLog } from "@/features/admin/adminSlice";
import { Badge } from "@/components/ui/badge";
import { Activity, Trash2, Edit, PlusCircle } from "lucide-react";

const entityMap: Record<string, { label: string }> = {
  Routine: { label: "Rutina" },
  User: { label: "Usuario" },
  Exercise: { label: "Ejercicio" },
  default: { label: "Sistema" },
};

export function useDashboardTable(data: IAuditLog[]) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<IAuditLog>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return (
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {date.toLocaleDateString("es-AR")}
              </span>
              <span className="text-xs text-muted-foreground">
                {date.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                hs
              </span>
            </div>
          );
        },
      },

 {
        accessorKey: "entity",
        header: "Entidad",
        cell: ({ row }) => {
          // 1. Obtenemos el nombre crudo de la entidad ("Routine")
          const rawEntity =
            row.original.entity ||
            (row.getValue("action") as string).split(" ")[1];

          // 2. Obtenemos la etiqueta traducida ("Rutina")
          const { label } = entityMap[rawEntity] || entityMap.default;

          // 🔥 3. Extraemos los detalles del registro original ("Pecho")
          const details = row.original.details;

          return (
            <div className="flex flex-col text-sm">
              <span className="font-medium text-primary">
                {/* 🔥 4. Mostramos "Rutina: Pecho" si hay detalles, si no, solo "Rutina" */}
                {details ? `${label}: ${details}` : label}
              </span>
            </div>
          );
        },
      },

      {
        accessorKey: "action",
        header: "Acción",
        cell: ({ row }) => {
          const fullAction = row.getValue("action") as string;

          let actionWord = fullAction.split(/_| /)[0];

          actionWord =
            actionWord.charAt(0).toUpperCase() +
            actionWord.slice(1).toLowerCase();

          let variant: "default" | "secondary" | "destructive" | "outline" =
            "outline";
          let Icon = Activity;

          if (actionWord.includes("Crear") || actionWord.includes("Registro")) {
            variant = "default";
            Icon = PlusCircle;
            actionWord = "Crear";
          } else if (
            actionWord.includes("Actualizar") ||
            actionWord.includes("Modificar")
          ) {
            variant = "secondary";
            Icon = Edit;
            actionWord = "Editar";
          } else if (actionWord.includes("Eliminar")) {
            variant = "destructive";
            Icon = Trash2;
          }

          return (
            <Badge variant={variant} className="gap-1 pl-1 pr-2">
              <Icon className="w-3 h-3" />
              <span>{actionWord}</span>
            </Badge>
          );
        },
      },

      {
        accessorKey: "performedBy",
        header: "Realizado por",
        cell: ({ row }) => {
          const actor = row.original.performedBy;
          return (
            <div className="flex flex-col text-sm">
              <span className="font-medium">
                {actor?.name} {actor?.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
                {actor?.email}
              </span>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table };
}
