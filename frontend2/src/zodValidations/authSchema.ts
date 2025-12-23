import { z } from "zod";

const dateRegex = /^([0-2]?\d|3[01])\/([0]?\d|1[0-2])\/(19|20)\d{2}$/;

// @register user
export const registerSchema = z
  .object({
    name: z
      .string("name must be a string")
      .nonempty("name is required")
      .min(3, "name must be at least 3 characters")
      .max(30, "name must be less than 30 characters"),
    lastName: z
      .string("last name must be a string")
      .nonempty("last name is required")
      .min(3, "last name must be at least 3 characters")
      .max(30, "last name must be less than 30 characters"),
    email: z
      .email("invalid email format")
      .min(3, "email must be at least 3 characters")
      .max(100, "email must be less than 100 characters"),
    password: z
      .string("password must be a string")
      .nonempty("password is required")
      .min(6, "password must be at least 6 characters")
      .max(100, "password must be less than 100 characters"),
    confirmPassword: z
      .string("confirm password must be a string")
      .nonempty("confirm password is required")
      .min(6, "confirm password must be at least 6 characters")
      .max(100, "confirm password must be less than 100 characters"),
    birthDate: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .refine(
        (val) => val === null || dateRegex.test(val),
        "Invalid date format DD/MM/YYYY"
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
      }, "Enter a valid date"),

    // GENDER
    gender: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable()
      .refine(
        (val) => val === null || ["male", "female", "other"].includes(val),
        "Invalid gender"
      ),

    // 🚨 CORRECCIÓN: HEIGHT
    // 🚨 CORRECCIÓN: HEIGHT
    height: z
      .preprocess(
        // Convertir "" o null a UNDEFINED para que .optional() lo salte
        (val) => (val === "" || val === null ? undefined : val), // FIX: z.union debe incluir z.undefined() para aceptar el valor del preprocess
        z.union([z.number(), z.string(), z.undefined()])
      )
      .transform((val) =>
        val === null || val === "" || val === undefined ? null : Number(val)
      )
      .optional() // Permite que el valor sea undefined si el preprocess lo devuelve
      .refine(
        (val) =>
          val === null ||
          val === undefined || // Permitir null o undefined
          (typeof val === "number" && val >= 100 && val <= 250),
        "Enter a valid height"
      )
      .nullable(),

    // WEIGHT
    // 🚨 CORRECCIÓN: WEIGHT
    weight: z
      .preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.union([z.number(), z.string(), z.undefined()]) // FIX: Incluir z.undefined()
      )
      .transform((val) =>
        val === null || val === "" || val === undefined ? null : Number(val)
      )
      .optional()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          (typeof val === "number" && val >= 1 && val <= 200),
        "Enter a valid weight"
      )
      .nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

// @login user
export const loginSchema = z.object({
  email: z
    .email("Invalid email format")
    .nonempty("email is required")
    .max(100, "email must be less than 100 characters"),
  password: z
    .string("password must be a string")
    .nonempty("password is required")
    .min(6, "password must be at least 6 characters")
    .max(100, "password must be less than 100 characters"),
});
