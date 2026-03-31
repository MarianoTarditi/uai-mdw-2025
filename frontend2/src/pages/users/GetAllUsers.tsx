import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { getAllUsers, selectAllUsers } from "@/features/users/userSlice";
import { useEffect, useState } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useUserTable } from "./Table/useUserTable";
import { UserTable } from "./Table/UserTable";
import { DataTableViewOptions } from "../../components/private/table/DataTableViewOptions";
import { Activity, ShieldCheck, UserCheck, UserPlus, UsersRound } from "lucide-react";
import { PageHero } from "@/components/private/premium/PageHero";
import { MetricStrip } from "@/components/private/premium/MetricStrip";
import { PremiumTableShell } from "@/components/private/premium/PremiumTableShell";
import { PremiumErrorState } from "@/components/private/premium/PremiumErrorState";
import { Button } from "@/components/ui/button";
import { CreateManagedUser } from "./components/CreateManagedUser";

export const GetAllUsers = () => {
  const dispatch = useAppDispatch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const users = useAppSelector(selectAllUsers);
  const { isFetchingLoading, isError } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (users.length > 0) return;
    dispatch(getAllUsers());
  }, [dispatch, users.length]);

  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = users.length - activeUsers;
  const adminOrTrainerUsers = users.filter(
    (user) => user.roles.includes("admin") || user.roles.includes("trainer"),
  ).length;

  const userMetrics = [
    {
      label: "Alumnos activos",
      value: activeUsers,
      helper: `${inactiveUsers} inactivos`,
      icon: UserCheck,
      tone: "positive" as const,
    },
    {
      label: "Equipo de gestión",
      value: adminOrTrainerUsers,
      helper: "Admins y trainers",
      icon: ShieldCheck,
      tone: "default" as const,
    },
    {
      label: "Base total",
      value: users.length,
      helper: "Usuarios registrados",
      icon: Activity,
      tone: "default" as const,
    },
  ];

  const { table } = useUserTable(users || []);

  if (isFetchingLoading) return <SpinnerButton variant="sizes" />;

  if (isError) {
    return (
      <PremiumErrorState
        title="Acceso denegado"
        description="No tienes los permisos necesarios para acceder a la sección de usuarios."
        tone="forbidden"
        fullScreen
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      <PageHero
        icon={UsersRound}
        title="Gestión de Alumnos"
        description="Controla perfiles, roles y estado operativo de la base para mantener seguimiento preciso y comunicación efectiva."
        badge={`${users.length} usuarios`}
      />

      <MetricStrip items={userMetrics} />

      <PremiumTableShell
        searchPlaceholder="Filtrar por nombre o email..."
        searchValue={(table.getState().globalFilter as string) ?? ""}
        onSearchChange={(value) => table.setGlobalFilter(value)}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreateOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Crear alumno
            </Button>
            <DataTableViewOptions table={table} />
          </div>
        }
      >
        <UserTable table={table} />
      </PremiumTableShell>

      <CreateManagedUser isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
    </div>
  );
};
