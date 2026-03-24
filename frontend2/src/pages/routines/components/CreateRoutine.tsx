"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { createRoutine, getStudents } from "@/features/routines/routineSlice";
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import { routineSchema } from "@/pages/routines/validations/routineSchema";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Search, Trash2, UserRound, WandSparkles } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit?: () => void;
}

type RoutineFormValues = z.infer<typeof routineSchema>;

const STEPS = [
  { id: 1, title: "Datos base" },
  { id: 2, title: "Builder de ejercicios" },
  { id: 3, title: "Revisión final" },
];

const EXERCISE_PRESETS = [
  { label: "Hipertrofia", sets: 4, reps: 10, restTime: 75 },
  { label: "Fuerza", sets: 5, reps: 5, restTime: 120 },
  { label: "Resistencia", sets: 3, reps: 15, restTime: 45 },
];

export function CreateRoutine({ isOpen, setIsOpen, onSubmit: onAfterSubmit }: Props) {
  const dispatch = useAppDispatch();
  const { isCreatingLoading, students } = useAppSelector((state) => state.routine);
  const { exercises } = useAppSelector((state) => state.exercise);

  const [step, setStep] = useState(1);
  const [studentSearch, setStudentSearch] = useState("");
  const [exerciseSearch, setExerciseSearch] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: "",
      description: "",
      studentId: "",
      exerciseAssignments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exerciseAssignments",
  });

  const values = watch();

  useEffect(() => {
    if (!isOpen) return;
    dispatch(getAllExercises());
    dispatch(getStudents());
    setStep(1);
    setStudentSearch("");
    setExerciseSearch("");
    reset({
      name: "",
      description: "",
      studentId: "",
      exerciseAssignments: [],
    });
  }, [dispatch, isOpen, reset]);

  const selectedStudent = useMemo(
    () => students.find((student) => student._id === values.studentId),
    [students, values.studentId],
  );

  const filteredStudents = useMemo(() => {
    const q = studentSearch.toLowerCase();
    return students.filter((student) =>
      `${student.name} ${student.lastName}`.toLowerCase().includes(q),
    );
  }, [studentSearch, students]);

  const selectedExerciseIds = useMemo(
    () => new Set((values.exerciseAssignments || []).map((item) => item.exerciseId)),
    [values.exerciseAssignments],
  );

  const filteredExercises = useMemo(() => {
    const q = exerciseSearch.toLowerCase();
    return exercises.filter((exercise) =>
      exercise.nombre.toLowerCase().includes(q),
    );
  }, [exerciseSearch, exercises]);

  const addExerciseToRoutine = (exerciseId: string) => {
    if (selectedExerciseIds.has(exerciseId)) {
      toast.info("Ese ejercicio ya está en la rutina");
      return;
    }
    append({
      exerciseId,
      sets: 3,
      reps: 10,
      restTime: 60,
    });
  };

  const applyPresetToExercise = (index: number, preset: (typeof EXERCISE_PRESETS)[number]) => {
    setValue(`exerciseAssignments.${index}.sets`, preset.sets, { shouldValidate: true });
    setValue(`exerciseAssignments.${index}.reps`, preset.reps, { shouldValidate: true });
    setValue(`exerciseAssignments.${index}.restTime`, preset.restTime, { shouldValidate: true });
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(["name", "studentId"]);
      if (!isValid) return;
    }

    if (step === 2) {
      const isValid = await trigger(["exerciseAssignments"]);
      if (!isValid) return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFormSubmit = async (data: RoutineFormValues) => {
    try {
      await dispatch(createRoutine(data)).unwrap();
      toast.success("Rutina creada correctamente");
      setIsOpen(false);
      onAfterSubmit?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Error al crear la rutina";

      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="premium-dialog sm:max-w-[1080px] p-0 bg-background text-foreground max-h-[92vh] overflow-hidden">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col">
          <DialogHeader className="premium-dialog-header px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <WandSparkles className="h-5 w-5 text-primary" />
              Routine Builder
            </DialogTitle>
            <DialogDescription>
              Construye rutinas por bloques como en herramientas profesionales de entrenamiento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="overflow-y-auto p-6">
              <div className="mb-5 flex flex-wrap gap-2">
                {STEPS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStep(item.id)}
                    data-active={step === item.id}
                    className={cn(
                      "premium-step-pill px-3 py-1.5 text-xs transition",
                      step === item.id
                        ? ""
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {item.id}. {item.title}
                  </button>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="routine-name">Nombre de la rutina</Label>
                    <Input
                      id="routine-name"
                      {...register("name")}
                      placeholder="Ej: Bloque fuerza tren inferior"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="routine-description">Objetivo del bloque</Label>
                    <Textarea
                      id="routine-description"
                      {...register("description")}
                      placeholder="Ej: Mejorar fuerza máxima y técnica de sentadilla."
                      className="min-h-[90px] resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Selecciona alumno</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Buscar alumno..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {filteredStudents.map((student) => {
                        const isSelected = values.studentId === student._id;
                        return (
                          <button
                            key={student._id}
                            type="button"
                            onClick={() => setValue("studentId", student._id, { shouldValidate: true })}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-3 text-left transition",
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-muted/40",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {student.name} {student.lastName}
                              </span>
                            </div>
                            {isSelected && <Badge>Seleccionado</Badge>}
                          </button>
                        );
                      })}
                    </div>

                    {errors.studentId && (
                      <p className="text-sm text-destructive">
                        {errors.studentId.message as string}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Buscar ejercicio para agregar..."
                      value={exerciseSearch}
                      onChange={(e) => setExerciseSearch(e.target.value)}
                    />
                  </div>

                  <div className="premium-editor-panel grid max-h-[240px] gap-2 overflow-y-auto p-2">
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise._id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3"
                      >
                        <div>
                          <p className="font-medium">{exercise.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {(exercise.musculosPrincipales || []).join(" - ")}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addExerciseToRoutine(String(exercise._id))}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Agregar
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {(fields || []).map((field, index) => {
                      const exercise = exercises.find((item) => item._id === field.exerciseId);
                      const rowErrors = errors.exerciseAssignments?.[index];

                      return (
                        <Card key={field.id} className="gap-3 py-4">
                          <CardHeader className="px-4 pb-0">
                            <CardTitle className="text-base">
                              {exercise?.nombre || "Ejercicio"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 px-4">
                            <input
                              type="hidden"
                              {...register(`exerciseAssignments.${index}.exerciseId`)}
                            />

                            <div className="flex flex-wrap gap-2">
                              {EXERCISE_PRESETS.map((preset) => (
                                <Button
                                  key={preset.label}
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => applyPresetToExercise(index, preset)}
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <div className="space-y-1">
                                <Label>Sets</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  {...register(`exerciseAssignments.${index}.sets`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label>Reps</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  {...register(`exerciseAssignments.${index}.reps`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label>Descanso (seg)</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  {...register(`exerciseAssignments.${index}.restTime`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </div>
                            </div>

                            {(rowErrors?.sets || rowErrors?.reps || rowErrors?.restTime) && (
                              <p className="text-xs text-destructive">
                                Completa valores válidos para este bloque.
                              </p>
                            )}

                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Quitar bloque
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {errors.exerciseAssignments?.message && (
                    <p className="text-sm text-destructive">
                      {errors.exerciseAssignments.message as string}
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Card className="premium-editor-panel">
                    <CardHeader>
                      <CardTitle>{values.name || "Nueva rutina"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        {values.description || "Sin descripción cargada."}
                      </p>
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Alumno</p>
                        <p className="font-medium">
                          {selectedStudent
                            ? `${selectedStudent.name} ${selectedStudent.lastName}`
                            : "No seleccionado"}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Bloques</p>
                        <div className="flex flex-wrap gap-1">
                          {(values.exerciseAssignments || []).map((assignment, idx) => {
                            const exercise = exercises.find(
                              (item) => item._id === assignment.exerciseId,
                            );
                            return (
                              <Badge key={`${assignment.exerciseId}-${idx}`} variant="secondary">
                                {exercise?.nombre || "Ejercicio"} - {assignment.sets}x{assignment.reps}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>

            <aside className="border-l bg-muted/20 p-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Panel rápido
              </h4>

              <div className="premium-editor-panel space-y-3 p-4 shadow-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Alumno asignado</p>
                  <p className="font-medium">
                    {selectedStudent
                      ? `${selectedStudent.name} ${selectedStudent.lastName}`
                      : "Pendiente"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Ejercicios en rutina</p>
                  <p className="text-2xl font-bold">{fields.length}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Recomendación</p>
                  <p className="text-sm">
                    4 a 6 ejercicios por rutina suelen mantener foco y adherencia.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <DialogFooter className="border-t px-6 py-4 sm:justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
                Anterior
              </Button>
              <Button type="button" variant="secondary" onClick={handleNext} disabled={step === 3}>
                Siguiente
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCreatingLoading || step !== 3}>
                {isCreatingLoading ? "Creando..." : "Crear rutina"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
