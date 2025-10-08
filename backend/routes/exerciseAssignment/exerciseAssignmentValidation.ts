import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const createExerciseAssignmentValidator = [
  check("exerciseId")
    .exists().withMessage("Exercise ID is required").bail()
    .notEmpty().withMessage("Exercise ID cannot be empty").bail()
    .isMongoId().withMessage("Invalid Exercise ID format"),

  check("sets")
    .exists().withMessage("Sets field is required").bail()
    .isInt({ min: 1 }).withMessage("Sets must be an integer greater than 0"),

  check("reps")
    .exists().withMessage("Reps field is required").bail()
    .isInt({ min: 1 }).withMessage("Reps must be an integer greater than 0"),

  check("restTime")
    .exists().withMessage("Rest time is required").bail()
    .isInt({ min: 0 }).withMessage("Rest time must be a non-negative integer"),

  check("notes")
    .optional()
    .isString().withMessage("Notes must be a string")
    .isLength({ max: 300 }).withMessage("Notes cannot exceed 300 characters"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  }
];

 const updateExerciseAssignmentValidator = [
  check("exerciseId")
    .exists().withMessage("Exercise ID is required").bail()
    .notEmpty().withMessage("Exercise ID cannot be empty").bail()
    .isMongoId().withMessage("Invalid Exercise ID format"),

  check("sets")
    .exists().withMessage("Sets field is required").bail()
    .isInt({ min: 1 }).withMessage("Sets must be an integer greater than 0"),

  check("reps")
    .exists().withMessage("Reps field is required").bail()
    .isInt({ min: 1 }).withMessage("Reps must be an integer greater than 0"),

  check("restTime")
    .exists().withMessage("Rest time is required").bail()
    .isInt({ min: 0 }).withMessage("Rest time must be a non-negative integer"),

  check("notes")
    .optional()
    .isString().withMessage("Notes must be a string")
    .isLength({ max: 300 }).withMessage("Notes cannot exceed 300 characters"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  }
];

const getExerciseAssignmentValidator = [
  check("id")
    .exists().withMessage("ID parameter is missing").bail()
    .notEmpty().withMessage("ID parameter is required").bail()
    .isMongoId().withMessage("Invalid ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];


export default {
  createExerciseAssignmentValidator,
  updateExerciseAssignmentValidator,
  getExerciseAssignmentValidator
};