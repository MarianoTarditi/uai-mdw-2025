import { z } from "zod";
import type { ZodType } from "zod";
import type { Musculo, Material, Etiqueta } from "@/types/auth";

export const exerciseSchema = z.object({
  nombre: z.string().min(1, "El campo Nombre es requerido"),

  musculosPrincipales: z
    .array(z.string())
    .min(1, "Seleccione al menos un músculo") as ZodType<Musculo[]>,

  musculosSecundarios: z.array(z.string()).optional().default([]) as ZodType<
    Musculo[]
  >,

  materialesNecesarios: z
    .array(z.string())
    .min(1, "Seccione al menos un material") as ZodType<Material[]>,

  etiquetas: z
    .array(z.string())
    .min(1, "Seleccione al menos una etiqueta") as ZodType<Etiqueta[]>,

  comentario: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});
