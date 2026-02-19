import { z } from "zod";

// Soporta D/M/YYYY o DD/MM/YYYY
const dateRegex = /^([0-2]?\d|3[01])\/([0]?\d|1[0-2])\/(19|20)\d{2}$/;

export const editProfileSchema = z.object({
  name: z.string().min(1, "El campo Nombre es requerido"),
  lastName: z.string().min(1, "El campo Apellido es requerido"),

  birthDate: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine(
      (val) => val === null || dateRegex.test(val),
      "Formato de fecha no válido DD/MM/AAAA"
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
    }, "Ingresa una fecha válida"),

  gender: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine(
      (val) => val === null || ["male", "female", "other"].includes(val),
      "Género inválido"
    ),

  height: z
    .preprocess(
      (val) => (val === "" || val === null ? null : val),
      z.union([z.number(), z.string()])
    )
    .transform((val) => (val === null || val === "" ? null : Number(val)))
    .refine(
      (val) =>
        val === null ||
        (!Number.isNaN(val as number) &&
          (val as number) >= 100 &&
          (val as number) <= 250),
      "Ingrese una altura válida"
    )
    .nullable(),

  weight: z
    .preprocess(
      (val) => (val === "" || val === null ? null : val),
      z.union([z.number(), z.string()])
    )
    .transform((val) => (val === null || val === "" ? null : Number(val)))
    .refine(
      (val) =>
        val === null ||
        (!Number.isNaN(val as number) &&
          (val as number) >= 1 &&
          (val as number) <= 200),
      "Ingrese un peso válido"
    )
    .nullable(),

  profileImage: z
    .union([z.string(), z.instanceof(FileList)])
    .nullable()
    .transform((val) => {
      if (val === null || val === "") return null;

      if (val instanceof FileList) {
        return val.length > 0 ? val.item(0) : null;
      }

      return val;
    })
    .refine((val) => {
      if (val === null) return true;

      if (val instanceof File) {
        return val.type.startsWith("image/") && val.size <= 5 * 1024 * 1024; 
      }

      if (typeof val === "string") return true;

      return false;
    }, "Tipo o formato de archivo de imagen no válido.")
    .nullable(),
});
