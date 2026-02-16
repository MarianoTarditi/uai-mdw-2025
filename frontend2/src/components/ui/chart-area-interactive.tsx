"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getChartData } from "@/features/admin/adminSlice";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Dumbbell, ClipboardList } from "lucide-react";

export const description = "An interactive area chart";

const chartConfig = {
  count: {
    label: "Cantidad",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  // 1. Estado para controlar qué tipo de datos estamos viendo
  const [dataType, setDataType] = React.useState("users");

  // 2. Obtenemos los datos de Redux
  const { chartData, isChartLoading } = useAppSelector((state) => state.admin);

  // 3. Efecto: Cuando cambia el dataType, pedimos los datos nuevos
  React.useEffect(() => {
    dispatch(getChartData(dataType));
  }, [dataType, dispatch]);

  // Labels dinámicos para el título
  const titleMap: Record<string, string> = {
    users: "Usuarios Registrados",
    routines: "Rutinas Creadas",
    exercises: "Ejercicios Creados",
  };

  // Función para corregir el desfase de zona horaria
  const parseDateLocal = (dateString: string) => {
    if (!dateString) return new Date();
    // Divide "2024-02-13" en [2024, 2, 13]
    const [year, month, day] = dateString.split("-").map(Number);
    // Crea la fecha en hora local (Mes es base 0 en JS, por eso month - 1)
    return new Date(year, month - 1, day);
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>{titleMap[dataType]}</CardTitle>
          <CardDescription>Historial de creación por fecha</CardDescription>
        </div>

        <CardAction>
          {/* CONTROL TIPO TOGGLE (Visible en pantallas medianas/grandes) */}
          <ToggleGroup
            type="single"
            value={dataType}
            onValueChange={(val) => val && setDataType(val)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="users" className="gap-2">
              <Users className="w-4 h-4" /> Usuarios
            </ToggleGroupItem>
            <ToggleGroupItem value="routines" className="gap-2">
              <ClipboardList className="w-4 h-4" /> Rutinas
            </ToggleGroupItem>
            <ToggleGroupItem value="exercises" className="gap-2">
              <Dumbbell className="w-4 h-4" /> Ejercicios
            </ToggleGroupItem>
          </ToggleGroup>

          {/* CONTROL TIPO SELECT (Visible en móviles) */}
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="users">Usuarios</SelectItem>
              <SelectItem value="routines">Rutinas</SelectItem>
              <SelectItem value="exercises">Ejercicios</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isChartLoading ? (
          <div className="h-[250px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = parseDateLocal(value);
                  return date.toLocaleDateString("es-AR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return parseDateLocal(value).toLocaleDateString("es-AR", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="count"
                type="monotone" // Curva suave
                fill="url(#fillCount)"
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
