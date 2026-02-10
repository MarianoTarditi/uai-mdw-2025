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
import { createRoutine } from "@/features/routines/routineSlice";
// 1. IMPORTAR ACCIÓN PARA TRAER EJERCICIOS
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import { routineSchema } from "@/zodValidations/routineSchema";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Plus, Trash, Check, ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";

// 2. IMPORTAR COMPONENTES PARA EL COMBOBOX
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

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit?: () => void;
}

type RoutineFormValues = z.infer<typeof routineSchema>;

export function CreateRoutine({
  isOpen,
  setIsOpen,
  onSubmit: onAfterSubmit,
}: Props) {
  const dispatch = useAppDispatch();
  const { isActionLoading } = useAppSelector((state) => state.routine);
  const { exercises } = useAppSelector((state) => state.exercise);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllExercises());
    }
  }, [isOpen, dispatch]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: "",
      description: "",
      exerciseAssignments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exerciseAssignments",
  });

  const handleFormSubmit = async (data: RoutineFormValues) => {
    try {
      await dispatch(createRoutine(data as any)).unwrap();

      toast.success("Rutina creada correctamente");
      reset();
      setIsOpen(false);

      if (onAfterSubmit) onAfterSubmit();
    } catch (error) {
      console.error("ERROR CREATE ROUTINE:", error);
      toast.error("Error al crear la rutina");
    }
  };

  if (isActionLoading) return <SpinnerButton variant="sizes" />;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader>
            <DialogTitle>Nueva rutina</DialogTitle>
            <DialogDescription>
              Crea una rutina y selecciona tus ejercicios existentes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* NOMBRE */}
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input {...register("name")} placeholder="Ej: Rutina de Pecho" />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* DESCRIPCIÓN */}
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Textarea
                {...register("description")}
                placeholder="Detalles..."
              />
            </div>

            {/* EJERCICIOS */}
            <div className="grid gap-3">
              <Label className="font-semibold">Ejercicios Asignados</Label>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-start border p-3 rounded-lg bg-slate-50 dark:bg-slate-900"
                >
                  {/* --- AQUÍ ESTÁ EL COMBOBOX --- */}
                  <div className="col-span-12 sm:col-span-5">
                    <Label className="text-xs mb-1 block">Ejercicio</Label>

                    <Controller
                      control={control}
                      name={`exerciseAssignments.${index}.exerciseId`}
                      render={({ field }) => {
                        // Estado local para abrir/cerrar ESTE popover específico
                        // eslint-disable-next-line
                        const [open, setOpen] = useState(false);

                        // Buscar el nombre del ejercicio seleccionado para mostrarlo
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
                                )}
                              >
                                {selectedExercise
                                  ? selectedExercise.nombre
                                  : "Seleccionar ejercicio..."}
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
                                        value={exercise.nombre} // Usamos nombre para buscar
                                        onSelect={() => {
                                          // Al seleccionar, guardamos el ID en el form
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

                    {errors.exerciseAssignments?.[index]?.exerciseId && (
                      <p className="text-[10px] text-red-500 mt-1">Requerido</p>
                    )}
                  </div>
                  {/* ----------------------------- */}

                  {/* SETS */}
                  <div className="col-span-3 sm:col-span-2">
                    <Label className="text-xs mb-1 block">Sets</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      {...register(`exerciseAssignments.${index}.sets`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* REPS */}
                  <div className="col-span-3 sm:col-span-2">
                    <Label className="text-xs mb-1 block">Reps</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      {...register(`exerciseAssignments.${index}.reps`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* REST */}
                  <div className="col-span-4 sm:col-span-2">
                    <Label className="text-xs mb-1 block">Descanso(s)</Label>
                    <Input
                      type="number"
                      placeholder="60"
                      {...register(`exerciseAssignments.${index}.restTime`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* BORRAR */}
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
              ))}

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

              {errors.exerciseAssignments && (
                <p className="text-sm text-red-500">
                  {Array.isArray(errors.exerciseAssignments)
                    ? "Error en los ejercicios"
                    : errors.exerciseAssignments.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar rutina</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
