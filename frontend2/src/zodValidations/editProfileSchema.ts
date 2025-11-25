import { z } from "zod";

// Soporta D/M/YYYY o DD/MM/YYYY
const dateRegex = /^([0-2]?\d|3[01])\/([0]?\d|1[0-2])\/(19|20)\d{2}$/;

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),

  // BIRTHDATE
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

  height: z
    .string() 
    .transform((val) => (val === "" ? null : Number(val)))
    .refine(
      (val) => val === null || (!Number.isNaN(val) && val >= 100 && val <= 250),
      "Enter a valid height"
    )
    .nullable(),

  // WEIGHT
  weight: z
    .string()
    .transform((val) => (val === "" ? null : Number(val)))
    .refine(
      (val) => val === null || (!Number.isNaN(val) && val >= 1 && val <= 200),
      "Enter a valid weight"
    )
    .nullable(),

  // PROFILE IMAGE
  profileImage: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .refine(
      (val) => val === null || /^https?:\/\/.+/.test(val),
      "Invalid image URL"
    ),
});
