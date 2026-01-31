// features/users/table/columns.tsx
import { type ColumnDef } from "@tanstack/react-table";
import { type IUserProfile } from "@/features/users/userSlice"; // O donde tengas tu interfaz
import { UserActionsCell } from "./UserActionsCell"; // El componente que me pasaste arriba
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<IUserProfile>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
        // Combinamos nombre y apellido
        const name = row.original.name;
        const lastName = row.original.lastName;
        return `${name} ${lastName}`;
    }
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[];
      return (
        <div className="flex gap-1">
          {roles.map((role) => (
            <Badge key={role} variant="secondary" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const active = row.getValue("isActive");
      return (
        <Badge variant={active ? "default" : "destructive"}>
          {active ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />, // Nota: Tu componente espera prop "exercise", deberías renombrarlo a "user" dentro del componente ActionsCell para ser semántico, pero funcionará igual.
  },
];