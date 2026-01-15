import { z } from "zod";
// Asegúrate de importar ZodType para poder usarlo en el casting
import type { ZodType } from "zod"; 
import type { Musculo, Material, Etiqueta } from "@/types/auth"; 

export const exerciseSchema = z.object({
  nombre: z.string().min(1, "Name is required"),

  // 1. Validamos que sea un array de strings (lo que viene del formulario)
  // 2. Usamos 'as ZodType<Musculo[]>' para forzar el tipo de salida correcto
  musculosPrincipales: z
    .array(z.string())
    .min(1, "Select at least one muscle") as ZodType<Musculo[]>,

  musculosSecundarios: z
    .array(z.string())
    .optional() as ZodType<Musculo[] | undefined>,

  materialesNecesarios: z
    .array(z.string())
    .min(1, "Select at least one material") as ZodType<Material[]>,

  etiquetas: z
    .array(z.string())
    .min(1, "Select at least one tag") as ZodType<Etiqueta[]>,

  // Asegúrate de incluir los campos opcionales para que coincidan con IExercise
  comentario: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});