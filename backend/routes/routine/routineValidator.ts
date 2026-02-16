import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const createRutineValidator = [
  check("name")
    .exists()
    .withMessage("Falta el campo nombre")
    .bail()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser una cadena de texto")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

  check("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser una cadena de texto")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción no debe exceder los 200 caracteres"),

  check("trainerId")
    .exists()
    .withMessage("Falta el campo trainerId")
    .bail()
    .notEmpty()
    .withMessage("El ID del entrenador es obligatorio")
    .bail()
    .isMongoId()
    .withMessage("El ID del entrenador debe ser un Mongo ID válido"),

  check("studentIds")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un ID de estudiante en el arreglo")
    .bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage("Cada ID de estudiante debe ser un Mongo ID válido"),

  check("exerciseAssignment")
    .isArray({ min: 1 })
    .withMessage(
      "Debe incluir al menos una asignación de ejercicio en el arreglo",
    )
    .bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage(
      "Cada ID de asignación de ejercicio debe ser un Mongo ID válido",
    ),

  check("muscleGroup")
    .exists()
    .withMessage("Falta el campo grupo muscular")
    .bail()
    .notEmpty()
    .withMessage("El grupo muscular es obligatorio")
    .bail()
    .isString()
    .withMessage("El grupo muscular debe ser una cadena de texto")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("El grupo muscular debe tener entre 3 y 50 caracteres"),

  check("startDate")
    .optional()
    .isDate()
    .withMessage("La fecha de inicio debe ser una fecha válida")
    .bail(),

  check("endDate")
    .optional()
    .isDate()
    .withMessage("La fecha de fin debe ser una fecha válida")
    .bail(),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage(
      "El campo isActive debe ser un valor booleano (verdadero o falso)",
    ),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const updateRutineValidator = [
  check("name")
    .exists()
    .withMessage("Falta el campo nombre")
    .bail()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser una cadena de texto")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe tener entre 3 y 50 caracteres"),

  check("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser una cadena de texto")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripción no debe exceder los 200 caracteres"),

  check("trainerId")
    .exists()
    .withMessage("Falta el campo trainerId")
    .bail()
    .notEmpty()
    .withMessage("El ID del entrenador es obligatorio")
    .bail()
    .isMongoId()
    .withMessage("El ID del entrenador debe ser un Mongo ID válido"),

  check("studentIds")
    .isArray({ min: 1 })
    .withMessage("Debe incluir al menos un ID de estudiante en el arreglo")
    .bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage("Cada ID de estudiante debe ser un Mongo ID válido"),

  check("exerciseAssignment")
    .isArray({ min: 1 })
    .withMessage(
      "Debe incluir al menos una asignación de ejercicio en el arreglo",
    )
    .bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage(
      "Cada ID de asignación de ejercicio debe ser un Mongo ID válido",
    ),

  check("muscleGroup")
    .exists()
    .withMessage("Falta el campo grupo muscular")
    .bail()
    .notEmpty()
    .withMessage("El grupo muscular es obligatorio")
    .bail()
    .isString()
    .withMessage("El grupo muscular debe ser una cadena de texto")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("El grupo muscular debe tener entre 3 y 50 caracteres"),

  check("startDate")
    .optional()
    .isDate()
    .withMessage("La fecha de inicio debe ser una fecha válida")
    .bail(),

  check("endDate")
    .optional()
    .isDate()
    .withMessage("La fecha de fin debe ser una fecha válida")
    .bail(),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage(
      "El campo isActive debe ser un valor booleano (verdadero o falso)",
    ),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getRutineValidator = [
  check("id")
    .exists()
    .withMessage("Falta el parámetro ID")
    .bail()
    .notEmpty()
    .withMessage("El parámetro ID es obligatorio")
    .bail()
    .isMongoId()
    .withMessage("Formato de ID inválido"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  getRutineValidator,
  updateRutineValidator,
  createRutineValidator,
};
