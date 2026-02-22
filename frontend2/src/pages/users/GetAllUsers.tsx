import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllUsers, selectAllUsers } from "@/features/users/userSlice";
import { useEffect } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Input } from "@/components/ui/input";
import { useUserTable } from "./Table/useUserTable";
import { UserTable } from "./Table/UserTable";
import { DataTableViewOptions } from "../../components/private/table/DataTableViewOptions";

export const GetAllUsers = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectAllUsers);
  const { isFetchingLoading, isError } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const { table } = useUserTable(users || []);

  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  return (
    <div className="relative w-full space-y-4">
      {isError && (
        <div className="relative flex h-screen items-center justify-center bg-background">
          <div className="absolute inset-0 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/5">
                <span className="text-2xl">🔒</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Acceso denegado</h2>

            <p className="text-sm text-muted-foreground mb-4">
              No tienes los permisos necesarios para acceder a la sección de usuarios.
            </p>
          </div>
        </div>
      )}

      <div className={isError ? "pointer-events-none opacity-30" : ""}>
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filtrar por nombre o email..."
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex items-center space-x-2">
            <DataTableViewOptions table={table} />
          </div>
        </div>

        <UserTable table={table} />
      </div>
    </div>
  );
};
