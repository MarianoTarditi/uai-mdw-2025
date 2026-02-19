import { z } from "zod"

const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .regex(onlyLettersRegex, "El nombre solo puede contener letras"),

  lastName: z
    .string()
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido es demasiado largo")
    .regex(onlyLettersRegex, "El apellido solo puede contener letras"),

  height: z.coerce
    .number()
    .nullable()
    .optional()
    .refine((val) => {
      if (val === null || val === undefined) return true
      
      return val === 0 || (val >= 50 && val <= 250)
    }, {
      message: "La altura debe ser 0 (sin definir) o estar entre 50 y 250 cm",
    }),

  weight: z.coerce
    .number()
    .nullable()
    .optional()
    .refine((val) => {
      if (val === null || val === undefined) return true
      
      return val === 0 || (val >= 20 && val <= 200)
    }, {
      message: "El peso debe ser 0 (sin definir) o estar entre 20 y 200 kg",
    }),

  birthDate: z
    .string()
    .nullable()
    .optional()
    .refine((value) => {
      if (!value) return true
      const date = new Date(value)
      return !isNaN(date.getTime())
    }, "Fecha de nacimiento inválida")
    .refine((value) => {
      if (!value) return true
      const date = new Date(value)
      return date <= new Date()
    }, "La fecha de nacimiento no puede ser futura")
    .refine((value) => {
      if (!value) return true
      const date = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      return age >= 13
    }, "El usuario debe tener al menos 13 años"),

  gender: z.enum(["male", "female", "other"]).nullable().optional(),
})