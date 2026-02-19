import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const CreateExerciseValidator = [
  check("nombre")
    .exists()
    .withMessage("El campo nombre no existe")
    .bail()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be 3-50 characters long"),

  check("comentario")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Comment must be max 200 characters long"),

  check("musculosPrincipales")
    .exists()
    .withMessage("Musculos principales field is missing")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos un músculo principal")
    .bail(),

  check("musculosSecundarios")
    .optional()
    .isArray()
    .withMessage("Musculos secundarios debe ser una lista (array)")
    .bail(),

  check("materialesNecesarios")
    .exists()
    .withMessage("Materiales field is missing")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos un material")
    .bail(),

  check("etiquetas")
    .exists()
    .withMessage("Etiquetas field is missing")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos una etiqueta")
    .bail(),

  check("videoUrl")
    .optional()
    .isString()
    .withMessage("Video URL must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Video URL too long"),

  check("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Image URL too long"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];
const UpdateExerciseValidator = [
  check("nombre")
    .exists()
    .withMessage("Name field is missing")
    .bail()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be 3-50 characters long"),

  check("comentario")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Comment must be max 200 characters long"),

  check("musculosPrincipales")
    .exists()
    .withMessage("Musculos principales field is missing")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos un músculo principal")
    .bail(),

  check("musculosSecundarios")
    .optional()
    .isArray()
    .withMessage("Musculos secundarios debe ser una lista (array)")
    .bail(),

  check("materialesNecesarios")
    .exists()
    .withMessage("Materiales field is missing")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos un material")
    .bail(),

  check("etiquetas")
    .exists()
    .withMessage("Etiquetas field is missing")
    .bail()
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos una etiqueta")
    .bail(),

  check("videoUrl")
    .optional()
    .isString()
    .withMessage("Video URL must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Video URL too long"),

  check("imageUrl")
    .optional()
    .isString()
    .withMessage("Image URL must be a string")
    .bail()
    .isLength({ max: 200 })
    .withMessage("Image URL too long"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getExerciseValidator = [
  check("id")
    .exists()
    .withMessage("ID parameter is missing")
    .bail()
    .notEmpty()
    .withMessage("ID parameter is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  getExerciseValidator,
  UpdateExerciseValidator,
  CreateExerciseValidator,
};
