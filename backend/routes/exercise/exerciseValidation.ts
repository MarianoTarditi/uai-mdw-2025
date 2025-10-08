import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const CreateExerciseValidator = [
  check("name")
    .exists().withMessage("Name field is missing").bail()
    .notEmpty().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Name must be 3-50 characters long"),

  check("description")
    .optional()
    .isString().withMessage("Description must be a string").bail()
    .isLength({ max: 200 }).withMessage("Lastname must be 200 characters long"),

  check("muscleGroup")
    .exists().withMessage("Muscle group field is missing").bail()
    .notEmpty().withMessage("Muscle group is required").bail()
    .isString().withMessage("Muscle group must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Muscle group must be 3-50 characters long"),

  check("videoUrl")
    .optional()
    .isString().withMessage("Video URL must be a string").bail()
    .isLength({ max: 200 }).withMessage("Video URL must be 300 characters long"),

  check("imageUrl")
    .optional()
    .isString().withMessage("Image URL must be a string").bail()
    .isLength({ max: 200 }).withMessage("Image URL must be 300 characters long"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const UpdateExerciseValidator = [
  check("name")
    .exists().withMessage("Name field is missing").bail()
    .notEmpty().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Name must be 3-50 characters long"),

  check("description")
    .isString().withMessage("Description must be a string").bail()
    .isLength({ min: 3, max: 200 }).withMessage("Lastname must be 3-200 characters long"),

  check("muscleGroup")
    .exists().withMessage("Muscle group field is missing").bail()
    .notEmpty().withMessage("Muscle group is required").bail()
    .isString().withMessage("Muscle group must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Muscle group must be 3-50 characters long"),

  check("videoUrl")
    .isString().withMessage("Video URL must be a string").bail()
    .isLength({ max: 200 }).withMessage("Video URL must be 300 characters long"),

  check("imageUrl")
    .isString().withMessage("Image URL must be a string").bail()
    .isLength({ max: 200 }).withMessage("Image URL must be 300 characters long"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getExerciseValidator = [
  check("id")
    .exists().withMessage("ID parameter is missing").bail()
    .notEmpty().withMessage("ID parameter is required").bail()
    .isMongoId().withMessage("Invalid ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  getExerciseValidator,
  UpdateExerciseValidator,
  CreateExerciseValidator
};