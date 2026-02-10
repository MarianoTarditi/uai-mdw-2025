import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllUsers, selectAllUsers } from "@/features/users/userSlice"; // Asegúrate de exportar selectAllUsers del slice
import { useEffect } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Input } from "@/components/ui/input"; // Faltaba importar Input
import { useUserTable } from "./Table/useUserTable";
import { UserTable } from "./Table/UserTable";
import { DataTableViewOptions } from "../../components/private/table/DataTableViewOptions"; // Puedes reutilizar este si es genérico

export const GetAllUsers = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectAllUsers);
  const { isFetchingLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const { table } = useUserTable(users || []);

  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar por email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center space-x-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <UserTable table={table} />
    </div>
  );
};
