// zodValidations/routineSchema.ts
import { z } from "zod";

export const routineSchema = z.object({
  name: z.string().min(3, "El nombre de la Rutina es obligarorio"),
  description: z.string().optional(),
  exerciseAssignments: z.array(
    z.object({
      exerciseId: z.string(),
      sets: z.number().min(1),
      reps: z.number().min(1),
      restTime: z.number().min(0),
    })
  ).min(1, "La rutina debe tener al menos un ejercicio"),
});
