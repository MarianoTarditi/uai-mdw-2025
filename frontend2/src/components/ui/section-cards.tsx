import { 
  Users, 
  Dumbbell, 
  ClipboardList, 
  UserCheck,
  CreditCard,
  Activity,
} from "lucide-react"; 

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/app/reduxHooks"; 
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function SectionCards() {
  const { stats, isLoading } = useAppSelector((state) => state.admin);

  const cardData = [
    {
      title: "Estudiantes",
      value: stats?.totalStudents || 0,
      description: "Total registrados",
      icon: Users,
      trend: `${stats?.activeStudents || 0} activos`,
    },
    {
      title: "Pagos pendientes",
      value: stats?.studentsWithPendingPayments || 0,
      description: "Estudiantes sin pago al día",
      icon: CreditCard,
      trend: "Seguimiento financiero",
    },
    {
      title: "Rutinas",
      value: stats?.totalRoutines || 0,
      description: "Rutinas creadas",
      icon: ClipboardList,
      trend: "Total histórico",
    },
    {
      title: "Progreso del mes",
      value: stats?.progressEntriesThisMonth || 0,
      description: "Entrenamientos cargados",
      icon: Activity,
      trend: "Adherencia de alumnos",
    },
    {
      title: "Entrenadores",
      value: stats?.totalTrainers || 0,
      description: "Entrenadores registrados",
      icon: UserCheck,
      trend: "Equipo actual",
    },
    {
      title: "Ejercicios",
      value: stats?.totalExercises || 0,
      description: "Biblioteca de ejercicios",
      icon: Dumbbell,
      trend: "Disponibles",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {cardData.map((item, index) => (
        <Card key={index} className="@container/card gap-4 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>{item.title}</CardDescription>
              <Badge variant="outline" className="text-[10px] uppercase tracking-[0.14em]">
                KPI {String(index + 1).padStart(2, "0")}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl flex items-center gap-2">
              {item.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-primary uppercase tracking-[0.07em]">
              <item.icon className="size-4" /> {item.trend}
            </div>
            <div className="text-muted-foreground">
              {item.description}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
