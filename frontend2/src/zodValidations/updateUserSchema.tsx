import { z } from "zod";

import {
  ARGENTINA_PHONE_PREFIX,
  ARGENTINA_PHONE_PLACEHOLDER,
  MANAGED_USER_WEIGHT_MAX,
  MANAGED_USER_WEIGHT_MIN,
  isEmptyArgentinaPhoneInput,
  normalizeArgentinaPhone,
} from "@/utils/phoneAr";

const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/;

const optionalNumberFromInput = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isFinite(parsedValue) ? parsedValue : value;
  }

  return value;
};

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

  phone: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine(
      (value) =>
        value == null ||
        isEmptyArgentinaPhoneInput(value) ||
        Boolean(normalizeArgentinaPhone(value)),
      `Ingresá un celular argentino válido, por ejemplo ${ARGENTINA_PHONE_PLACEHOLDER}`,
    )
    .transform((value) => {
      if (value == null || isEmptyArgentinaPhoneInput(value)) {
        return null;
      }

      return normalizeArgentinaPhone(value) ?? ARGENTINA_PHONE_PREFIX;
    }),

  height: z.preprocess(
    optionalNumberFromInput,
    z
      .number()
      .nullable()
      .optional()
      .refine((value) => value == null || (value >= 50 && value <= 250), {
        message: "La altura debe estar entre 50 y 250 cm",
      }),
  ),

  weight: z.preprocess(
    optionalNumberFromInput,
    z
      .number()
      .nullable()
      .optional()
      .refine(
        (value) =>
          value == null ||
          (value >= MANAGED_USER_WEIGHT_MIN &&
            value <= MANAGED_USER_WEIGHT_MAX),
        {
          message: `El peso debe estar entre ${MANAGED_USER_WEIGHT_MIN} y ${MANAGED_USER_WEIGHT_MAX} kg`,
        },
      ),
  ),

  birthDate: z
    .string()
    .nullable()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }, "Fecha de nacimiento invalida")
    .refine((value) => {
      if (!value) return true;
      const date = new Date(value);
      return date <= new Date();
    }, "La fecha de nacimiento no puede ser futura")
    .refine((value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 13;
    }, "El usuario debe tener al menos 13 años"),

  gender: z.enum(["male", "female", "other"]).nullable().optional(),
});
