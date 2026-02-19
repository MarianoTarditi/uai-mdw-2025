import { z } from "zod";

const dateRegex = /^([0-2]?\d|3[01])\/([0]?\d|1[0-2])\/(19|20)\d{2}$/;

export const registerSchema = z
  .object({
    name: z
      .string("El nombre es requerido")
      .min(1, "El nombre es requerido") 
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(30, "El nombre debe tener menos de 30 caracteres"),
    lastName: z
      .string("El apellido es requerido")
      .min(1, "El apellido es requerido")
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .max(30, "El apellido debe tener menos de 30 caracteres"),
    email: z
      .email("Formato de email inválido")
      .min(3, "El email debe tener al menos 3 caracteres")
      .max(100, "El email debe tener menos de 100 caracteres"),
    password: z
      .string("La contraseña es requerida")
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña debe tener menos de 100 caracteres"),
    confirmPassword: z
      .string("Confirmar contraseña es requerido")
      .min(1, "Confirmar contraseña es requerido")
      .min(6, "La confirmación debe tener al menos 6 caracteres")
      .max(100, "La confirmación debe tener menos de 100 caracteres"),
    birthDate: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .refine(
        (val) => val === null || dateRegex.test(val),
        "Formato de fecha inválido (DD/MM/AAAA)",
      )
      .refine((val) => {
        if (!val) return true;

        const [day, month, year] = val.split("/").map(Number);
        const birth = new Date(year, month - 1, day);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }

        return age >= 10 && age <= 100;
      }, "Fecha inválida (debes tener entre 10 y 100 años)"),

    gender: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .refine(
        (val) => val === null || ["male", "female", "other"].includes(val),
        "Género inválido",
      ),

    height: z
      .preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.union([z.number(), z.string(), z.undefined()]),
      )
      .transform((val) =>
        val === null || val === "" || val === undefined ? null : Number(val),
      )
      .optional()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          (typeof val === "number" && val >= 100 && val <= 250),
        "Ingresa una altura válida (100-250 cm)",
      )
      .nullable(),

    weight: z
      .preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.union([z.number(), z.string(), z.undefined()]),
      )
      .transform((val) =>
        val === null || val === "" || val === undefined ? null : Number(val),
      )
      .optional()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          (typeof val === "number" && val >= 1 && val <= 200),
        "Ingresa un peso válido (1-200 kg)",
      )
      .nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string("El email es requerido")
    .email("Formato de email inválido")
    .min(1, "El email es requerido")
    .max(100, "El email debe tener menos de 100 caracteres"),
  password: z
    .string("La contraseña es requerida")
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña debe tener menos de 100 caracteres"),
});
