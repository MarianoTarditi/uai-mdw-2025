import { z } from "zod";

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


