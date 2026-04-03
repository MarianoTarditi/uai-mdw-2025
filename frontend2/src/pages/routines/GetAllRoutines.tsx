"use client";

import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { fetchRoutines } from "@/features/routines/routineSlice";
import { RoutineTable } from "./table/RoutineTable";
import { useRoutineTable } from "./table/useRoutineTable";
import { RoutineButton } from "./table/RoutineButton";
import { DataTableViewOptions } from "@/components/private/table/DataTableViewOptions";
import { useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/private/premium/PageHero";
import { PremiumTableShell } from "@/components/private/premium/PremiumTableShell";
import { PremiumErrorState } from "@/components/private/premium/PremiumErrorState";

export function GetAllRoutines() {
  const dispatch = useAppDispatch();

  const { routines, isFetchingLoading, isError, message } = useAppSelector(
    (state) => state.routine,
  );
  const { profile } = useAppSelector((state) => state.user);
  const canManageTemplates =
    profile?.roles?.includes("trainer") || profile?.roles?.includes("admin");
  const isStudent = profile?.roles?.includes("student");

  useEffect(() => {
    if (routines.length > 0) return;
    dispatch(fetchRoutines());
  }, [dispatch, routines.length]);

  const { table } = useRoutineTable(routines);

  const isForbidden =
    isError &&
    (message?.toLowerCase().includes("permisos") ||
      message?.toLowerCase().includes("forbidden") ||
      message?.toLowerCase().includes("403"));

  if (isFetchingLoading && routines.length === 0) {
    return <SpinnerButton variant="sizes" />;
  }

  if (isError) {
    return (
      <PremiumErrorState
        title={isForbidden ? "Acceso denegado" : "Ops! Algo salió mal"}
        description={
          isForbidden
            ? 'No tienes los permisos necesarios para acceder a la sección de "Rutinas".'
            : message || "No se pudieron cargar las rutinas en este momento."
        }
        tone={isForbidden ? "forbidden" : "default"}
        retryLabel={isForbidden ? undefined : "Reintentar"}
        onRetry={isForbidden ? undefined : () => dispatch(fetchRoutines())}
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      <PageHero
        icon={ClipboardList}
        title="Biblioteca de Rutinas"
        description="Estructura mesociclos y plantillas con una operativa agil para asignar, iterar y escalar planes por objetivo."
        badge={`${routines.length} rutinas`}
      />

      <PremiumTableShell
        searchPlaceholder="Buscar rutina por nombre..."
        searchValue={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onSearchChange={(value) => table.getColumn("name")?.setFilterValue(value)}
        actions={
          <>
            {(canManageTemplates || isStudent) && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-full px-4"
              >
                <Link to="/RoutineTemplates">Plantillas Excel/PDF</Link>
              </Button>
            )}
            {canManageTemplates && <RoutineButton />}
            <DataTableViewOptions table={table} />
          </>
        }
      >
        <RoutineTable table={table} />
      </PremiumTableShell>
    </div>
  );
}
