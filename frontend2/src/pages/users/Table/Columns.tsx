import { type ColumnDef } from "@tanstack/react-table";
import { type IUserProfile } from "@/features/users/userSlice";
import { UserActionsCell } from "./UserActionsCell";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATIC_BASE_URL = import.meta.env.VITE_STATIC_URL;

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return "/UserDefault.png";
  return `${STATIC_BASE_URL}${imagePath}`;
};

export const columns: ColumnDef<IUserProfile>[] = [
  {
    accessorKey: "profileImage",
    header: "Foto",
    cell: ({ row }) => {
      const imageUrl = getImageUrl(row.original.profileImage);

      return (
        <img
          src={imageUrl}
          alt="Foto del usuario"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/UserDefault.png";
          }}
        />
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Usuario <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      const lastName = row.original.lastName;
      return (
        <span className="font-medium">
          {name} {lastName}
        </span>
      );
    },
  },

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
        <Badge
          className={
            active
              ? "border border-emerald-400/30 bg-emerald-600 text-white shadow-sm shadow-emerald-950/10 hover:bg-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
              : "border border-rose-400/30 bg-rose-600 text-white shadow-sm shadow-rose-950/10 hover:bg-rose-700 dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/30"
          }
          variant="default"
        >
          {active ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
