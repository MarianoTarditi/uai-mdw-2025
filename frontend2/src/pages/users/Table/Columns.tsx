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
          // 👇 Si es activo, aplicamos verde. Si no, dejamos que el variant maneje el color.
          className={active ? "bg-green-500 hover:bg-green-600" : ""} 
          variant={active ? "default" : "destructive"}
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
