"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Dumbbell, Repeat, Ban, Eye, User } from "lucide-react";

import type { IRoutine } from "@/features/routines/routineTypes";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect, useState } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { reset, getRoutineById } from "@/features/routines/routineSlice";
import { DetailExercise } from "@/pages/exercises/components/DetailExercise";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DetailRoutineProps {
  routine: IRoutine | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DetailRoutine({
  routine,
  isOpen,
  setIsOpen,
}: DetailRoutineProps) {
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
  }, [isOpen, routine?._id, isCheckingAuth, dispatch]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dispatch(reset());
    }
  };

  const handleViewExercise = (exercise: any) => {
    if (!exercise) return;
    setSelectedExercise(exercise);
    setIsExerciseDetailOpen(true);
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

  const API_URL = import.meta.env.VITE_STATIC_URL;

  const imageUrl =
    isStudentPopulated && studentData.profileImage
      ? studentData.profileImage.startsWith("http")
        ? studentData.profileImage
        : `${API_URL}${studentData.profileImage}`
      : "";

  const shouldShowSpinner =
    isDetailLoading || !detailedRoutine || detailedRoutine._id !== routine?._id;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[650px] h-[90vh] flex flex-col bg-background text-foreground p-0 gap-0 overflow-hidden">
          <div className="p-6 pb-2 shrink-0">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl">
                    Detalles de Rutina
                  </DialogTitle>
                </div>
                {detailedRoutine?.isTemplate && (
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    Plantilla
                  </Badge>
                )}
              </div>
            </DialogHeader>
          </div>

          {shouldShowSpinner ? (
            <div className="flex flex-col justify-center items-center h-64 gap-2">
              <SpinnerButton variant="sizes" />
              <span className="text-sm text-muted-foreground">
                Cargando datos...
              </span>
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0 w-full">
              <div className="p-6 pt-2 flex flex-col h-full gap-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Nombre de la rutina</Label>
                    <Input readOnly value={detailedRoutine?.name || ""} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Asignado a</Label>

                    {isStudentPopulated ? (
                      <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/20">
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

                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">
                            {studentData.name} {studentData.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {studentData.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md bg-muted/20 text-sm text-muted-foreground italic flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          {detailedRoutine?.isTemplate
                            ? "Sin asignar (Plantilla)"
                            : "Datos de usuario no disponibles"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Descripción</Label>
                    <Textarea
                      readOnly
                      value={detailedRoutine?.description || "Sin descripción"}
                      className="resize-none min-h-[60px]"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                    <span>Plan de Entrenamiento</span>
                    <Badge variant={hasExercises ? "secondary" : "outline"}>
                      {exercisesList.length} Ejercicios
                    </Badge>
                  </h3>

                  <div className="space-y-4">
                    {hasExercises ? (
                      exercisesList.map((assignment: any, index: number) => {
                        const exInfo = assignment.exerciseId;
                        const exName =
                          exInfo?.nombre || "Ejercicio no disponible";
                        const isPopulated =
                          typeof exInfo === "object" && exInfo !== null;

                        return (
                          <Card
                            key={index}
                            className="overflow-hidden border-l-4 border-l-primary/50 shadow-sm"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-base flex items-center gap-2">
                                  <span className="text-muted-foreground text-sm">
                                    #{index + 1}
                                  </span>
                                  {exName}
                                </h4>

                                {isPopulated && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 hover:bg-primary/10 hover:text-primary ml-2"
                                    onClick={() => handleViewExercise(exInfo)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    <span className="text-xs font-medium">
                                      Ver detalle
                                    </span>
                                  </Button>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-4 mb-4">
                                {exInfo.musculosPrincipales?.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-wrap gap-1">
                                      {exInfo.musculosPrincipales.map(
                                        (m: string) => (
                                          <Badge
                                            key={m}
                                            className="text-[10px] px-2 h-5 bg-primary/90 hover:bg-primary"
                                          >
                                            {m}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {exInfo.musculosSecundarios?.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-wrap gap-1">
                                      {exInfo.musculosSecundarios.map(
                                        (m: string) => (
                                          <Badge
                                            key={m}
                                            variant="secondary"
                                            className="text-[10px] px-2 h-5"
                                          >
                                            {m}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {exInfo.etiquetas?.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-wrap gap-1">
                                      {exInfo.etiquetas.map((tag: string) => (
                                        <Badge
                                          key={tag}
                                          variant="outline"
                                          className="text-[10px] px-2 h-5"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {exInfo.materialesNecesarios?.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-wrap gap-1">
                                      {exInfo.materialesNecesarios.map(
                                        (mat: string) => (
                                          <Badge
                                            key={mat}
                                            variant="outline"
                                            className="text-[10px] px-2 h-5"
                                          >
                                            {mat}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-3 gap-2 bg-muted/40 p-2 rounded-lg border border-border/60">
                                <div className="flex flex-col items-center justify-center p-1">
                                  <div className="flex items-center text-muted-foreground text-[10px] uppercase mb-1 font-bold">
                                    <Dumbbell className="w-3 h-3 mr-1" /> Sets
                                  </div>
                                  <span className="font-mono font-bold text-sm">
                                    {assignment.sets || 0}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center border-x border-border/30 p-1">
                                  <div className="flex items-center text-muted-foreground text-[10px] uppercase mb-1 font-bold">
                                    <Repeat className="w-3 h-3 mr-1" /> Reps
                                  </div>
                                  <span className="font-mono font-bold text-sm">
                                    {assignment.reps || 0}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-1">
                                  <div className="flex items-center text-muted-foreground text-[10px] uppercase mb-1 font-bold">
                                    <Clock className="w-3 h-3 mr-1" /> Rest
                                  </div>
                                  <span className="font-mono font-bold text-sm">
                                    {assignment.restTime || 0}s
                                  </span>
                                </div>
                              </div>

                              {assignment.notes && (
                                <div className="mt-3 text-xs text-amber-700 dark:text-amber-400 italic bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900">
                                  <span className="font-semibold not-italic">
                                    Nota de rutina:
                                  </span>{" "}
                                  {assignment.notes}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5 gap-2">
                        <div className="bg-muted p-3 rounded-full">
                          <Ban className="w-6 h-6 opacity-50" />
                        </div>
                        <p className="font-medium text-sm">
                          Sin ejercicios asignados
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground flex justify-between pt-4 border-t mt-4">
                  <span>Creado: {formatDate(detailedRoutine?.createdAt)}</span>
                  <span>
                    Última act.: {formatDate(detailedRoutine?.updatedAt)}
                  </span>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="p-6 pt-2 border-t bg-muted/10 shrink-0">
            {" "}
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
