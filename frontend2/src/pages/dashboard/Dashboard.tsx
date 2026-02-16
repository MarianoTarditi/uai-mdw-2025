"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getDashboardStats, getAuditLogs } from "@/features/admin/adminSlice";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { SectionCards } from "@/components/ui/section-cards";
import { DashboardTable } from "../dashboard/table/DashboardTable";
import { useDashboardTable } from "../dashboard/table/useDashboardTable";
import { resetAdminState } from "@/features/admin/adminSlice";
import { Lock } from "lucide-react";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const { auditLogs, isError } = useAppSelector((state) => state.admin);

  const { isCheckingAuth, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isCheckingAuth && user) {
      dispatch(getDashboardStats());
      dispatch(getAuditLogs());
    }
  }, [dispatch, isCheckingAuth, user]);

  useEffect(() => {
    dispatch(resetAdminState());
  }, [dispatch]);

  const { table } = useDashboardTable(auditLogs || []);

  if (isError) {
    return (
      <div className="relative flex min-h-screen items-start justify-center bg-background pt-60">
        <div className="absolute inset-0 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-2">Acceso denegado</h2>

          <p className="text-sm text-muted-foreground">
            No tienes los permisos necesarios para acceder a la sección de
            "Dashboard".
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <div className="px-4 lg:px-6 flex flex-col gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                Registro de Actividad Reciente
              </h2>
              <DashboardTable table={table} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
