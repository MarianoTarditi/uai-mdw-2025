import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  muscleGroup: z.string().min(2, "El grupo muscular es obligatorio"),
  description: z
    .string()
    .optional(),
  videoUrl: z.string().url("Debe ser una URL válida").optional(),
  imageUrl: z.string().url("Debe ser una URL válida").optional(),
});
