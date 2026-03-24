"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getDashboardStats, getAuditLogs } from "@/features/admin/adminSlice";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { DashboardTable } from "../dashboard/table/DashboardTable";
import { useDashboardTable } from "../dashboard/table/useDashboardTable";
import { resetAdminState } from "@/features/admin/adminSlice";
import {
  Activity,
  CreditCard,
  Dumbbell,
  Flame,
  Gauge,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHero } from "@/components/private/premium/PageHero";
import { MetricStrip } from "@/components/private/premium/MetricStrip";
import { PremiumTableShell } from "@/components/private/premium/PremiumTableShell";
import { PremiumErrorState } from "@/components/private/premium/PremiumErrorState";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const { auditLogs, isError, stats } = useAppSelector((state) => state.admin);

  const { isCheckingAuth, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isCheckingAuth && user) {
      void Promise.all([dispatch(getDashboardStats()), dispatch(getAuditLogs())]);
    }
  }, [dispatch, isCheckingAuth, user]);

  useEffect(() => {
    dispatch(resetAdminState());
  }, [dispatch]);

  const {
    table,
    globalFilter,
    setGlobalFilter,
    actionFilter,
    setActionFilter,
    filteredCount,
    totalCount,
  } = useDashboardTable(auditLogs || []);

  const dashboardMetrics = [
    {
      label: "Estudiantes activos",
      value: stats?.activeStudents ?? 0,
      helper: `Total: ${stats?.totalStudents ?? 0}`,
      icon: Users,
      tone: "positive" as const,
    },
    {
      label: "Pagos pendientes",
      value: stats?.studentsWithPendingPayments ?? 0,
      helper: "Seguimiento financiero",
      icon: CreditCard,
      tone: "warning" as const,
    },
    {
      label: "Rutinas + Ejercicios",
      value: (stats?.totalRoutines ?? 0) + (stats?.totalExercises ?? 0),
      helper: `${stats?.totalRoutines ?? 0} rutinas · ${stats?.totalExercises ?? 0} ejercicios`,
      icon: Dumbbell,
      tone: "default" as const,
    },
    {
      label: "Progreso del mes",
      value: stats?.progressEntriesThisMonth ?? 0,
      helper: "Entrenamientos registrados",
      icon: Activity,
      tone: "default" as const,
    },
  ];

  if (isError) {
    return (
      <PremiumErrorState
        title="Acceso denegado"
        description='No tienes los permisos necesarios para acceder a la sección de "Dashboard".'
        tone="forbidden"
        fullScreen
      />
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <PageHero
                icon={Flame}
                title="Performance Command Center"
                description="Monitorea alumnos, pagos, rutinas y progreso en un tablero con foco total en consistencia, disciplina y resultados medibles."
                badge={`${filteredCount}/${totalCount} eventos`}
                chips={["Ritmo Diario", "Gestion Integral", "Control Tactico"]}
                rightSlot={<Gauge className="h-4 w-4 text-primary" />}
              />
            </div>

            <div className="px-4 lg:px-6">
              <MetricStrip items={dashboardMetrics} />
            </div>

            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6">
              <PremiumTableShell
                searchPlaceholder="Buscar por usuario, email o detalle..."
                searchValue={globalFilter}
                onSearchChange={setGlobalFilter}
                actions={
                  <Select
                    value={actionFilter}
                    onValueChange={(value) =>
                      setActionFilter(value as "all" | "create" | "update" | "delete")
                    }
                  >
                    <SelectTrigger className="w-full sm:w-44">
                      <SelectValue placeholder="Tipo de acción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="create">Creaciones</SelectItem>
                      <SelectItem value="update">Ediciones</SelectItem>
                      <SelectItem value="delete">Eliminaciones</SelectItem>
                    </SelectContent>
                  </Select>
                }
              >
                <DashboardTable table={table} />
              </PremiumTableShell>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
