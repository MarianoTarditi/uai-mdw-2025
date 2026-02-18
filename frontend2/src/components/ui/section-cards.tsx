import { 
  Users, 
  Dumbbell, 
  ClipboardList, 
  UserCheck 
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

export function SectionCards() {
  const { stats, isLoading } = useAppSelector((state) => state.admin);

  const cardData = [
    {
      title: "Estudiantes",
      value: stats?.totalStudents || 0,
      description: "Estudiantes activos",
      icon: Users,
      trend: "+ Activos",
    },
    {
      title: "Entrenadores",
      value: stats?.totalTrainers || 0,
      description: "Entrenadores registrados",
      icon: UserCheck,
      trend: "Activos",
    },
    {
      title: "Rutinas",
      value: stats?.totalRoutines || 0,
      description: "Rutinas creadas",
      icon: ClipboardList,
      trend: "Total histórico",
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
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardData.map((item, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
              {item.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium text-primary">
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