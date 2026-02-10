"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Clock, Dumbbell, Repeat, Ban } from "lucide-react"; // Agregué el icono Ban

import type { IRoutine } from "@/features/routines/routineTypes";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { reset, getRoutineById } from "@/features/routines/routineSlice";

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

  const { isLoading, selectedRoutine: detailedRoutine } = useAppSelector(
    (state) => state.routine,
  );

  useEffect(() => {
    if (isOpen && routine?._id) {
      dispatch(reset());
      dispatch(getRoutineById(routine._id));
    }
  }, [isOpen, routine?._id, dispatch]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dispatch(reset());
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
    if (!year || !month || !day) return "-";
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // 1. EXTRAEMOS LA LISTA PARA FACILITAR LA LÓGICA
  const exercisesList = detailedRoutine?.exerciseAssignments || [];
  const hasExercises = exercisesList.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col bg-background text-foreground p-0 gap-0">
        {/* HEADER */}
        <div className="p-6 pb-2">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl">
                  Detalles de Rutina
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  ID: {detailedRoutine?._id || routine?._id || "..."}
                </DialogDescription>
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

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-2">
            <SpinnerButton variant="sizes" />
            <span className="text-sm text-muted-foreground">
              Cargando datos...
            </span>
          </div>
        ) : (
          <ScrollArea className="flex-1 p-6 pt-2">
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Nombre de la Rutina</Label>
                  <Input readOnly value={detailedRoutine?.name || ""} />
                </div>

                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Textarea
                    readOnly
                    value={detailedRoutine?.description || "Sin descripción"}
                    className="resize-none min-h-[80px]"
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

                <div className="space-y-3">
                  {/* LÓGICA DIRECTA: O muestra lista O muestra mensaje vacío */}
                  {hasExercises ? (
                    exercisesList.map((assignment: any, index: number) => {
                      const exInfo = assignment.exerciseId;
                      const exName =
                        exInfo?.name ||
                        exInfo?.nombre ||
                        "Ejercicio no disponible";
                      const isPopulated =
                        typeof exInfo === "object" && exInfo !== null;

                      return (
                        <Card
                          key={index}
                          className="overflow-hidden border-l-4 border-l-primary/50 shadow-sm"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="w-full">
                                <h4 className="font-bold text-base flex items-center gap-2">
                                  <span className="text-muted-foreground text-sm">
                                    #{index + 1}
                                  </span>
                                  {exName}
                                  {!isPopulated && (
                                    <p className="text-xs text-red-500 mt-1">
                                      Error de datos
                                    </p>
                                  )}
                                </h4>

                                {exInfo?.musculosPrincipales && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {exInfo.musculosPrincipales.map(
                                      (m: string) => (
                                        <Badge
                                          key={m}
                                          variant="secondary"
                                          className="text-[10px] px-1.5 h-5"
                                        >
                                          {m}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3 bg-muted/30 p-2 rounded-lg border border-border/50">
                              <div className="flex flex-col items-center justify-center p-1">
                                <div className="flex items-center text-muted-foreground text-[10px] uppercase mb-1">
                                  <Dumbbell className="w-3 h-3 mr-1" /> Sets
                                </div>
                                <span className="font-mono font-bold text-sm">
                                  {assignment.sets || 0}
                                </span>
                              </div>
                              <div className="flex flex-col items-center justify-center border-x border-border/50 p-1">
                                <div className="flex items-center text-muted-foreground text-[10px] uppercase mb-1">
                                  <Repeat className="w-3 h-3 mr-1" /> Reps
                                </div>
                                <span className="font-mono font-bold text-sm">
                                  {assignment.reps || 0}
                                </span>
                              </div>
                              <div className="flex flex-col items-center justify-center p-1">
                                <div className="flex items-center text-muted-foreground text-[10px] uppercase mb-1">
                                  <Clock className="w-3 h-3 mr-1" /> Rest
                                </div>
                                <span className="font-mono font-bold text-sm">
                                  {assignment.restTime || 0}s
                                </span>
                              </div>
                            </div>

                            {assignment.notes && (
                              <div className="mt-2 text-xs text-muted-foreground italic bg-yellow-500/5 p-2 rounded border border-yellow-500/10">
                                📝 {assignment.notes}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    /* ESTADO VACÍO MEJORADO */
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5 gap-2">
                      <div className="bg-muted p-3 rounded-full">
                        <Ban className="w-6 h-6 opacity-50" />
                      </div>
                      <p className="font-medium text-sm">
                        Sin ejercicios asignados
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Esta rutina está vacía actualmente.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* METADATA */}
              <div className="text-[10px] text-muted-foreground flex justify-between pt-4 border-t mt-4">
                <span>Creado: {formatDate(detailedRoutine?.createdAt)}</span>
                <span>
                  Última act.: {formatDate(detailedRoutine?.updatedAt)}
                </span>
              </div>
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="p-6 pt-2 border-t bg-muted/10">
          <DialogClose asChild>
            <Button type="button" className="w-full sm:w-auto">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
