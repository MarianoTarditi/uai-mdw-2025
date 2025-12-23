import { z } from "zod";

// --- Utility Functions & Definitions ---

// Helper for optional string fields (converts "" to null, allows undefined)
const optionalString = z
  .string()
  .transform((e) => (e === "" ? null : e))
  .nullable()
  .optional();

// Helper for optional Yes/No enums
const yesNoEnum = z
  .enum(["Yes", "No"], {
    errorMap: (issue, ctx) => ({ message: "Please select Yes or No" }),
  })
  .optional();

// Helper for optional number inputs (handles empty string, coerces to number)
const optionalNumber = z
  .preprocess(
    (val) => (val === "" || val === null ? undefined : val), // Convert "" or null to undefined
    z.coerce.number({ invalid_type_error: "Must be a valid number" })
  )
  .optional()
  .nullable(); // The final stored value can be null

// ====================================================
// MASTER SCHEMA DEFINITION
// ====================================================
export const fullProfileSchema = z.object({
  // ----------------------------------------------------
  // STEP 1: PERSONAL & CONTACT DATA (Required fields marked with *)
  // ----------------------------------------------------
  firstName: z.string().min(2, "First Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  dni: z.string().min(6, "DNI/ID is required"),
  email: z.string().email("Invalid email format"),

  // Optional fields
  address: optionalString,
  phone: optionalString,
  profession: optionalString,
  birthDate: optionalString, // Assuming DD/MM/YYYY format handled in presentation layer

  // ----------------------------------------------------
  // STEP 2: EMERGENCY DATA
  // ----------------------------------------------------
  emergencyContactName: optionalString,
  emergencyContactRelation: optionalString,
  emergencyContactPhone: optionalString,

  // ----------------------------------------------------
  // STEP 3: CLINICAL & ACTIVITY DATA
  // ----------------------------------------------------

  // CLINICAL
  hasCurrentInjury: yesNoEnum,
  injuryDescription: optionalString,
  hasPreexistingCondition: yesNoEnum,
  medicalConditionDescription: optionalString,
  isTakingMedication: yesNoEnum,
  medicationDetails: optionalString, // What medication?

  // ACTIVITY HISTORY
  hasTrainingExperience: yesNoEnum,
  trainingExperienceDetails: optionalString, // Specify
  practicesCurrentActivity: yesNoEnum,
  currentActivityDetails: optionalString, // Specify
  activityFrequency: optionalString, // How frequently?
  hasOldInjuriesOrDiscomfort: yesNoEnum,

  // GOALS
  goals: optionalString,

  // MEASUREMENTS
  height: optionalNumber,
  weight: optionalNumber,

  // Other fields (like profile image path)
  profileImage: optionalString,
});

export type IFullProfileData = z.infer<typeof fullProfileSchema>;
