import { z } from "zod";
import { ETIQUETAS, MATERIALES, MUSCULOS } from "@/pages/exercises/constants";

export const exerciseSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El campo nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 letras"),

  musculosPrincipales: z
    .array(z.enum(MUSCULOS))
    .min(1, "Seleccione al menos un músculo"),

  musculosSecundarios: z.array(z.enum(MUSCULOS)).default([]),

  materialesNecesarios: z
    .array(z.enum(MATERIALES))
    .min(1, "Seccione al menos un material"),

  etiquetas: z
    .array(z.enum(ETIQUETAS))
    .min(1, "Seleccione al menos una etiqueta"),

  comentario: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
