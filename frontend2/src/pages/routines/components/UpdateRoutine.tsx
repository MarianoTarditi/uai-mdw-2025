"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import {
  updateRoutine,
  reset,
  getStudents,
} from "@/features/routines/routineSlice";
import { routineSchema } from "@/pages/routines/validations/routineSchema";
import type { IRoutine } from "@/features/routines/routineTypes";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Plus, Trash, Check, ChevronsUpDown, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface UpdateRoutineProps {
  routine: IRoutine | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface IStudentOption {
  _id: string;
  name: string;
  lastName: string;
}

type RoutineFormValues = z.infer<typeof routineSchema>;

export function UpdateRoutine({
  routine,
  isOpen,
  setIsOpen,
}: UpdateRoutineProps) {
  const dispatch = useAppDispatch();
  const { isUpdatingLoading, students } = useAppSelector(
    (state) => state.routine,
  );
  const { exercises } = useAppSelector((state) => state.exercise);

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
    formState: { errors, isSubmitted },
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

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllExercises());
      dispatch(getStudents());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen || !routine) return;

    const formattedAssignments = routine.exerciseAssignments.map((assign) => ({
      exerciseId:
        typeof assign.exerciseId === "string"
          ? assign.exerciseId
          : assign.exerciseId?._id,
      sets: assign.sets,
      reps: assign.reps,
      restTime: assign.restTime || 60,
    }));

    const studentIdValue =
      typeof routine.studentId === "object" && routine.studentId !== null
        ? routine.studentId._id
        : routine.studentId || "";

    resetForm({
      name: routine.name,
      description: routine.description || "",
      studentId: studentIdValue,
      exerciseAssignments: formattedAssignments,
    });
  }, [isOpen, routine, resetForm]);

  const onSubmit = async (data: RoutineFormValues) => {
    if (!routine?._id) return;

    try {
      await dispatch(
        updateRoutine({
          id: routine._id,
          routineData: data,
        }),
      ).unwrap();

      toast.success("Rutina actualizada correctamente");
      dispatch(reset());
      setIsOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Error al actualizar la rutina";
      toast.error(errorMessage);
    }
  };

  const [openStudentCombo, setOpenStudentCombo] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="premium-dialog sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="premium-dialog-header mb-4 px-1 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <WandSparkles className="h-4 w-4 text-primary" />
              Editar Rutina
            </DialogTitle>
            <DialogDescription>
              Modifica el nombre, descripción o los ejercicios asignados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Asignar a Estudiante</Label>
              <Controller
                control={control}
                name="studentId"
                render={({ field }) => {
                  const selectedStudent = students?.find(
                    (s) => String(s._id) === String(field.value),
                  );

                  return (
                    <>
                      <Popover
                        open={openStudentCombo}
                        onOpenChange={setOpenStudentCombo}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              errors.studentId && "border-destructive",
                            )}
                          >
                            {selectedStudent
                              ? `${selectedStudent.name} ${selectedStudent.lastName}`
                              : field.value
                                ? "Cargando nombre..."
                                : "Seleccionar alumno"}

                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Buscar alumno..." />
                            <CommandList>
                              <CommandEmpty>
                                No se encontró el alumno.
                              </CommandEmpty>
                              <CommandGroup>
                                {students.map((student: IStudentOption) => (
                                  <CommandItem
                                    key={student._id}
                                    value={`${student.name} ${student.lastName}`}
                                    onSelect={() => {
                                      field.onChange(student._id);
                                      setOpenStudentCombo(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === student._id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {student.name} {student.lastName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {errors.studentId && (
                        <p className="text-sm text-destructive">
                          {errors.studentId.message as string}
                        </p>
                      )}
                    </>
                  );
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input {...register("name")} placeholder="Ej: Rutina de Pecho" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Textarea
                {...register("description")}
                placeholder="Detalles de la rutina..."
                className="resize-none"
              />
            </div>

            <div className="grid gap-3">
              <Label className="font-semibold">Ejercicios Asignados</Label>

              {fields.map((field, index) => {
                const rowErrors = errors.exerciseAssignments?.[index];

                return (
                  <div
                    key={field.id}
                    className="premium-editor-panel grid grid-cols-12 items-start gap-2 p-3"
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <Label className="text-xs mb-1 block">Ejercicio</Label>

                      <Controller
                        control={control}
                        name={`exerciseAssignments.${index}.exerciseId`}
                        render={({ field }) => {
                          // eslint-disable-next-line
                          const [open, setOpen] = useState(false);

                          const selectedExercise = exercises.find(
                            (ex) => ex._id === field.value,
                          );

                          return (
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className={cn(
                                    "w-full justify-between font-normal",
                                    !field.value && "text-muted-foreground",
                                    rowErrors?.exerciseId &&
                                      "border-destructive focus:ring-destructive",
                                  )}
                                >
                                  {selectedExercise
                                    ? selectedExercise.nombre
                                    : "Seleccionar..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-[300px] p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput placeholder="Buscar ejercicio..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No se encontró el ejercicio.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {exercises.map((exercise) => (
                                        <CommandItem
                                          key={exercise._id}
                                          value={exercise.nombre}
                                          onSelect={() => {
                                            field.onChange(exercise._id);
                                            setOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === exercise._id
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {exercise.nombre}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          );
                        }}
                      />

                      {rowErrors?.exerciseId && (
                        <p className="text-[10px] text-destructive mt-1">
                          Requerido
                        </p>
                      )}
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <Label className="text-xs mb-1 block">Sets</Label>
                      <Input
                        type="number"
                        placeholder="3"
                        className={cn(rowErrors?.sets && "border-destructive")}
                        {...register(`exerciseAssignments.${index}.sets`, {
                          valueAsNumber: true,
                        })}
                      />
                      {rowErrors?.sets && (
                        <p className="text-[10px] text-destructive mt-1 leading-tight">
                          {rowErrors.sets.message as string}
                        </p>
                      )}
                    </div>

                    <div className="col-span-3 sm:col-span-2">
                      <Label className="text-xs mb-1 block">Reps</Label>
                      <Input
                        type="number"
                        placeholder="10"
                        className={cn(rowErrors?.reps && "border-destructive")}
                        {...register(`exerciseAssignments.${index}.reps`, {
                          valueAsNumber: true,
                        })}
                      />
                      {rowErrors?.reps && (
                        <p className="text-[10px] text-destructive mt-1 leading-tight">
                          {rowErrors.reps.message as string}
                        </p>
                      )}
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <Label className="text-xs mb-1 block">Descanso(s)</Label>
                      <Input
                        type="number"
                        placeholder="60"
                        className={cn(
                          rowErrors?.restTime && "border-destructive",
                        )}
                        {...register(`exerciseAssignments.${index}.restTime`, {
                          valueAsNumber: true,
                        })}
                      />
                      {rowErrors?.restTime && (
                        <p className="text-[10px] text-destructive mt-1 leading-tight">
                          {rowErrors.restTime.message as string}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex items-end justify-center pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                className="mt-2 border-dashed"
                onClick={() =>
                  append({ exerciseId: "", sets: 3, reps: 10, restTime: 60 })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar ejercicio
              </Button>
              {isSubmitted && fields.length === 0 && (
                <p className="text-sm text-destructive mt-2">
                  La rutina debe tener al menos un ejercicio
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUpdatingLoading}>
              {isUpdatingLoading ? (
                <>
                  <SpinnerButton variant="sizes" /> Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
