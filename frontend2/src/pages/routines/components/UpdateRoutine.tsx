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
// Asegúrate de importar la acción para obtener ejercicios
import { getAllExercises } from "@/features/exercises/exerciseSlice";
import { updateRoutine, reset } from "@/features/routines/routineSlice";
import { routineSchema } from "@/zodValidations/routineSchema";
import type { IRoutine } from "@/features/routines/routineTypes";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
// Iconos necesarios
import { Plus, Trash, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
// Componentes Shadcn
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

type RoutineFormValues = z.infer<typeof routineSchema>;

export function UpdateRoutine({
  routine,
  isOpen,
  setIsOpen,
}: UpdateRoutineProps) {
  const dispatch = useAppDispatch();
  const { isActionLoading } = useAppSelector((state) => state.routine);
  // 1. OBTENEMOS LOS EJERCICIOS DEL STATE
  const { exercises } = useAppSelector((state) => state.exercise);

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
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

  // 2. CARGAR EJERCICIOS AL ABRIR EL MODAL
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllExercises());
    }
  }, [isOpen, dispatch]);

  // 3. RELLENAR EL FORMULARIO CON DATOS EXISTENTES
  useEffect(() => {
    if (isOpen && routine) {
      const formattedAssignments = routine.exerciseAssignments.map(
        (assign) => ({
          // Si el ejercicio viene populado (objeto), extraemos el _id, si no, usamos el string
          exerciseId:
            typeof assign.exerciseId === "string"
              ? assign.exerciseId
              : (assign.exerciseId as any)._id,
          sets: assign.sets,
          reps: assign.reps,
          restTime: assign.restTime || 60,
        }),
      );

      resetForm({
        name: routine.name,
        description: routine.description || "",
        exerciseAssignments: formattedAssignments,
      });
    }
  }, [isOpen, routine, resetForm]);

  const onSubmit = async (data: RoutineFormValues) => {
    if (!routine?._id) return;

    try {
      await dispatch(
        updateRoutine({
          id: routine._id,
          routineData: data as any,
        }),
      ).unwrap();

      toast.success("Rutina actualizada correctamente");
      dispatch(reset());
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error || "Error al actualizar la rutina");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Rutina</DialogTitle>
            <DialogDescription>
              Modifica el nombre, descripción o los ejercicios asignados.
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
                placeholder="Detalles de la rutina..."
                className="resize-none"
              />
            </div>

            {/* LISTA DE EJERCICIOS */}
            <div className="grid gap-3">
              <Label className="font-semibold">Ejercicios Asignados</Label>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2 items-start border p-3 rounded-lg bg-slate-50 dark:bg-slate-900"
                >
                  {/* --- COMBOBOX CONTROLADO --- */}
                  <div className="col-span-12 sm:col-span-5">
                    <Label className="text-xs mb-1 block">Ejercicio</Label>

                    <Controller
                      control={control}
                      name={`exerciseAssignments.${index}.exerciseId`}
                      render={({ field: { value, onChange } }) => (
                        <ExerciseCombobox
                          value={value}
                          onChange={onChange}
                          exercises={exercises}
                        />
                      )}
                    />

                    {errors.exerciseAssignments?.[index]?.exerciseId && (
                      <p className="text-[10px] text-red-500 mt-1">Requerido</p>
                    )}
                  </div>

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

                  {/* REST TIME */}
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
                className="mt-2 border-dashed w-full"
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
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isActionLoading}>
              {isActionLoading ? (
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

// --- SUBCOMPONENTE PARA EL COMBOBOX ---
// Esto aísla el estado 'open' de cada fila y evita re-renders innecesarios
interface ExerciseComboboxProps {
  value: string;
  onChange: (value: string) => void;
  exercises: any[]; // Usa tu tipo IExercise[] aquí si lo tienes importado
}

function ExerciseCombobox({
  value,
  onChange,
  exercises,
}: ExerciseComboboxProps) {
  const [open, setOpen] = useState(false);

  // Buscamos el ejercicio seleccionado para mostrar su nombre
  const selectedExercise = exercises.find((ex) => ex._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal px-3",
            !value && "text-muted-foreground",
          )}
        >
          {selectedExercise ? selectedExercise.nombre : "Seleccionar..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] sm:w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No encontrado.</CommandEmpty>
            <CommandGroup>
              {exercises.map((exercise) => (
                <CommandItem
                  key={exercise._id}
                  value={exercise.nombre} // El buscador filtra por este valor
                  onSelect={() => {
                    onChange(exercise._id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === exercise._id ? "opacity-100" : "opacity-0",
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
}
