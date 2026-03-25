"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getRoutineById, reset } from "@/features/routines/routineSlice";
import type { IRoutine } from "@/features/routines/routineTypes";
import { DetailExercise } from "@/pages/exercises/components/DetailExercise";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Ban,
  Clock3,
  Dumbbell,
  Eye,
  Layers,
  Repeat,
  Timer,
  User,
} from "lucide-react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";

interface DetailRoutineProps {
  routine: IRoutine | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type ExerciseInfo = {
  _id?: string;
  nombre?: string;
  musculosPrincipales?: string[];
  musculosSecundarios?: string[];
  etiquetas?: string[];
  materialesNecesarios?: string[];
};

export function DetailRoutine({ routine, isOpen, setIsOpen }: DetailRoutineProps) {
  const dispatch = useAppDispatch();
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [isExerciseDetailOpen, setIsExerciseDetailOpen] = useState(false);

  const { isDetailLoading, selectedRoutine: detailedRoutine } = useAppSelector(
    (state) => state.routine,
  );
  const { isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isCheckingAuth && isOpen && routine?._id) {
      dispatch(reset());
      dispatch(getRoutineById(routine._id));
    }
  }, [dispatch, isCheckingAuth, isOpen, routine?._id]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) dispatch(reset());
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    if (!year || !month || !day) return "-";
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const exercisesList = detailedRoutine?.exerciseAssignments || [];
  const hasExercises = exercisesList.length > 0;
  const studentData = detailedRoutine?.studentId as any;
  const isStudentPopulated =
    studentData && typeof studentData === "object" && "name" in studentData;

  const staticUrl = import.meta.env.VITE_STATIC_URL;
  const imageUrl =
    isStudentPopulated && studentData.profileImage
      ? studentData.profileImage.startsWith("http")
        ? studentData.profileImage
        : `${staticUrl}${studentData.profileImage}`
      : "";

  const shouldShowSpinner =
    isDetailLoading || !detailedRoutine || detailedRoutine._id !== routine?._id;

  const summary = useMemo(() => {
    const exerciseCount = exercisesList.length;
    const totalSets = exercisesList.reduce(
      (acc: number, item: any) => acc + Number(item.sets || 0),
      0,
    );
    const totalReps = exercisesList.reduce(
      (acc: number, item: any) => acc + Number(item.reps || 0),
      0,
    );
    const volume = exercisesList.reduce(
      (acc: number, item: any) =>
        acc + Number(item.sets || 0) * Number(item.reps || 0),
      0,
    );
    const avgRest =
      exerciseCount > 0
        ? Math.round(
            exercisesList.reduce(
              (acc: number, item: any) => acc + Number(item.restTime || 0),
              0,
            ) / exerciseCount,
          )
        : 0;
    const estimatedSeconds = exercisesList.reduce((acc: number, item: any) => {
      const sets = Number(item.sets || 0);
      const reps = Number(item.reps || 0);
      const rest = Number(item.restTime || 0);

      // Aproximación simple para lectura rápida del entrenador.
      const activeTime = sets * Math.max(20, reps * 3);
      const restTime = Math.max(0, sets - 1) * rest;
      return acc + activeTime + restTime;
    }, 0);
    const estimatedMinutes = Math.max(1, Math.round(estimatedSeconds / 60));

    return {
      exerciseCount,
      totalSets,
      totalReps,
      volume,
      avgRest,
      estimatedMinutes,
    };
  }, [exercisesList]);

  const handleViewExercise = (exercise: ExerciseInfo) => {
    if (!exercise) return;
    setSelectedExercise(exercise);
    setIsExerciseDetailOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[980px] h-[92vh] flex flex-col bg-background text-foreground p-0 gap-0 overflow-hidden">
          <div className="border-b bg-gradient-to-r from-primary/10 via-card to-card px-6 py-5 shrink-0">
            <DialogHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-xl">Detalle de rutina</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {detailedRoutine?.name || "Cargando nombre..."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {detailedRoutine?.isTemplate ? (
                    <Badge variant="outline" className="border-primary text-primary">
                      Plantilla
                    </Badge>
                  ) : (
                    <Badge>Asignada</Badge>
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          {shouldShowSpinner ? (
            <div className="flex h-72 flex-col items-center justify-center gap-2">
              <SpinnerButton variant="sizes" />
              <span className="text-sm text-muted-foreground">Cargando datos...</span>
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Card className="py-3">
                      <CardContent className="px-4 py-0">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Ejercicios
                        </p>
                        <p className="text-xl font-semibold">{summary.exerciseCount}</p>
                      </CardContent>
                    </Card>
                    <Card className="py-3">
                      <CardContent className="px-4 py-0">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Volumen
                        </p>
                        <p className="text-xl font-semibold">{summary.volume}</p>
                      </CardContent>
                    </Card>
                    <Card className="py-3">
                      <CardContent className="px-4 py-0">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Duración
                        </p>
                        <p className="text-xl font-semibold">{summary.estimatedMinutes}m</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="py-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Datos generales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-1.5">
                        <Label>Nombre de rutina</Label>
                        <Input readOnly value={detailedRoutine?.name || ""} />
                      </div>

                      <div className="grid gap-1.5">
                        <Label>Descripción</Label>
                        <Textarea
                          readOnly
                          value={detailedRoutine?.description || "Sin descripción"}
                          className="resize-none min-h-[90px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="rounded-md border p-2">
                          Creado: {formatDate(detailedRoutine?.createdAt)}
                        </div>
                        <div className="rounded-md border p-2 text-right">
                          Actualizado: {formatDate(detailedRoutine?.updatedAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <aside className="space-y-4">
                  <Card className="py-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Alumno asignado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isStudentPopulated ? (
                        <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                          <Avatar className="h-10 w-10 border border-primary/20">
                            <AvatarImage
                              src={imageUrl}
                              alt={studentData.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="font-bold text-primary bg-primary/10">
                              {studentData.name?.[0]}
                              {studentData.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {studentData.name} {studentData.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {studentData.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {detailedRoutine?.isTemplate
                            ? "Sin asignar (plantilla)"
                            : "Datos de usuario no disponibles"}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="py-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Carga de trabajo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Layers className="h-4 w-4" /> Series
                        </span>
                        <span className="font-semibold">{summary.totalSets}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Repeat className="h-4 w-4" /> Reps
                        </span>
                        <span className="font-semibold">{summary.totalReps}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Timer className="h-4 w-4" /> Descanso medio
                        </span>
                        <span className="font-semibold">{summary.avgRest}s</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border p-2 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Clock3 className="h-4 w-4" /> Duración estimada
                        </span>
                        <span className="font-semibold">{summary.estimatedMinutes} min</span>
                      </div>
                    </CardContent>
                  </Card>
                </aside>
              </div>

              <Separator />

              <div className="p-6 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Plan de entrenamiento
                  </h3>
                  <Badge variant={hasExercises ? "secondary" : "outline"}>
                    {summary.exerciseCount} bloques
                  </Badge>
                </div>

                {hasExercises ? (
                  <div className="space-y-3">
                    {exercisesList.map((assignment: any, index: number) => {
                      const exInfo = assignment.exerciseId as ExerciseInfo | null;
                      const isPopulated = !!(exInfo && typeof exInfo === "object");
                      const exName = exInfo?.nombre || "Ejercicio no disponible";

                      return (
                        <Card key={index} className="border-l-4 border-l-primary/60 py-4">
                          <CardContent className="px-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Bloque #{index + 1}</p>
                                <h4 className="font-semibold text-base">{exName}</h4>
                              </div>
                              {isPopulated && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewExercise(exInfo)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver ejercicio
                                </Button>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {(exInfo?.musculosPrincipales || []).map((muscle) => (
                                <Badge key={`p-${muscle}`} className="bg-primary/90 hover:bg-primary">
                                  {muscle}
                                </Badge>
                              ))}
                              {(exInfo?.musculosSecundarios || []).map((muscle) => (
                                <Badge key={`s-${muscle}`} variant="secondary">
                                  {muscle}
                                </Badge>
                              ))}
                              {(exInfo?.etiquetas || []).map((tag) => (
                                <Badge key={`t-${tag}`} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/25 p-2">
                              <div className="rounded-md bg-card p-2 text-center">
                                <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center justify-center gap-1">
                                  <Dumbbell className="h-3 w-3" /> Sets
                                </p>
                                <p className="text-sm font-bold">{assignment.sets || 0}</p>
                              </div>
                              <div className="rounded-md bg-card p-2 text-center">
                                <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center justify-center gap-1">
                                  <Repeat className="h-3 w-3" /> Reps
                                </p>
                                <p className="text-sm font-bold">{assignment.reps || 0}</p>
                              </div>
                              <div className="rounded-md bg-card p-2 text-center">
                                <p className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center justify-center gap-1">
                                  <Timer className="h-3 w-3" /> Rest
                                </p>
                                <p className="text-sm font-bold">{assignment.restTime || 0}s</p>
                              </div>
                            </div>

                            {assignment.notes && (
                              <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                                <span className="font-semibold">Nota:</span> {assignment.notes}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-muted/5 py-10 text-muted-foreground">
                    <div className="rounded-full bg-muted p-3">
                      <Ban className="h-6 w-6 opacity-60" />
                    </div>
                    <p className="text-sm font-medium">Sin ejercicios asignados</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="border-t bg-muted/10 px-6 py-4 shrink-0">
            <div className="mr-auto hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <Activity className="h-3.5 w-3.5" />
              Vista optimizada para seguimiento de carga y ejecución.
            </div>
            <DialogClose asChild>
              <Button type="button" className="w-full sm:w-auto">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedExercise && (
        <DetailExercise
          exercise={selectedExercise}
          isOpen={isExerciseDetailOpen}
          setIsOpen={setIsExerciseDetailOpen}
        />
      )}
    </>
  );
}

