import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { type IAuditLog } from "@/features/admin/adminSlice";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CalendarClock,
  Edit,
  FileText,
  PlusCircle,
  Trash2,
  UserCircle2,
  UserRound,
} from "lucide-react";

const entityMap: Record<string, { label: string }> = {
  Routine: { label: "Rutina" },
  User: { label: "Usuario" },
  Exercise: { label: "Ejercicio" },
  Progress: { label: "Progreso" },
  default: { label: "Sistema" },
};

type ActionFilter = "all" | "create" | "update" | "delete";

const getActionMeta = (fullAction: string) => {
  const normalized = (fullAction || "").toLowerCase();

  if (
    normalized.includes("crear") ||
    normalized.includes("registro") ||
    normalized.includes("create")
  ) {
    return {
      label: "Creación",
      variant: "default" as const,
      Icon: PlusCircle,
      key: "create" as const,
    };
  }

  if (
    normalized.includes("actualizar") ||
    normalized.includes("modificar") ||
    normalized.includes("update")
  ) {
    return {
      label: "Edición",
      variant: "secondary" as const,
      Icon: Edit,
      key: "update" as const,
    };
  }

  if (normalized.includes("eliminar") || normalized.includes("delete")) {
    return {
      label: "Eliminación",
      variant: "destructive" as const,
      Icon: Trash2,
      key: "delete" as const,
    };
  }

  return {
    label: "Actividad",
    variant: "outline" as const,
    Icon: Activity,
    key: "all" as const,
  };
};

export function useDashboardTable(data: IAuditLog[]) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState<ActionFilter>("all");

  const filteredData = React.useMemo(() => {
    return data.filter((log) => {
      if (actionFilter !== "all") {
        const actionType = getActionMeta(log.action || "").key;
        if (actionType !== actionFilter) return false;
      }

      if (!globalFilter.trim()) return true;

      const search = globalFilter.toLowerCase();
      const searchable = [
        log.action,
        log.entity,
        log.details,
        log.performedBy?.name,
        log.performedBy?.lastName,
        log.performedBy?.email,
        log.affectedUser?.name,
        log.affectedUser?.lastName,
        log.affectedUser?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }, [actionFilter, data, globalFilter]);

  const columns = React.useMemo<ColumnDef<IAuditLog>[]>(
    () => [
      {
        id: "event",
        header: "Evento",
        cell: ({ row }) => {
          const rawEntity = row.original.entity || "default";
          const { label } = entityMap[rawEntity] || entityMap.default;
          const action = getActionMeta(row.original.action || "");

          return (
            <div className="flex items-center gap-2">
              <Badge variant={action.variant} className="gap-1 pl-1 pr-2">
                <action.Icon className="w-3 h-3" />
                <span>{action.label}</span>
              </Badge>
              <span className="text-sm font-medium text-primary">{label}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "details",
        header: "Detalle",
        cell: ({ row }) => {
          const details = row.original.details;

          return (
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="line-clamp-2">{details || "Sin detalle adicional"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "performedBy",
        header: "Realizado por",
        cell: ({ row }) => {
          const actor = row.original.performedBy;
          return (
            <div className="flex flex-col text-sm gap-0.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <UserCircle2 className="h-3.5 w-3.5" />
                Admin/Trainer
              </span>
              <span className="font-medium">
                {actor?.name} {actor?.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground">{actor?.email}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "affectedUser",
        header: "Afectado",
        cell: ({ row }) => {
          const affected = row.original.affectedUser;
          if (!affected)
            return <span className="text-xs text-muted-foreground">-</span>;

          return (
            <div className="flex flex-col text-sm gap-0.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <UserRound className="h-3.5 w-3.5" />
                Usuario
              </span>
              <span className="font-medium">
                {affected.name} {affected.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {affected.email}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMinutes / 60);
          const diffDays = Math.floor(diffHours / 24);

          let relative = "Ahora";
          if (diffMinutes >= 1 && diffMinutes < 60) relative = `Hace ${diffMinutes} min`;
          if (diffHours >= 1 && diffHours < 24) relative = `Hace ${diffHours} h`;
          if (diffDays >= 1) relative = `Hace ${diffDays} d`;

          return (
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                {relative}
              </span>
              <span className="font-medium text-sm leading-none">
                {date.toLocaleDateString("es-AR")}
              </span>
              <span className="text-xs text-muted-foreground leading-none">
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
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    actionFilter,
    setActionFilter,
    filteredCount: filteredData.length,
    totalCount: data.length,
  };
}

