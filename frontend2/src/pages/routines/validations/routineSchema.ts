import { z } from "zod";

export const routineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El campo nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 letras"),
  description: z.string().optional(),

  studentId: z.string().min(1, "Debe la rutina a un estudiante"),

exerciseAssignments: z
    .array(
      z.object({
        exerciseId: z.string().min(1, "Seleccione un ejercicio"), 
        sets: z.number().min(1, "Las series no pueden ser 0"),
        reps: z.number().min(1, "Las repeticiones no pueden ser 0"),
        restTime: z.number().min(1, "El tiempo de descanso no puede ser 0"),
      }),
    )
    .min(1, "La rutina debe tener al menos un ejercicio"),
});