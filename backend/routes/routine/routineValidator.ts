import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const createRutineValidator = [
  check("name")
    .exists().withMessage("Name field is missing").bail()
    .notEmpty().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Name must be 3-50 characters long"),

  check("description")
    .optional()
    .isString().withMessage("Description must be a string").bail()
    .isLength({ max: 200 }).withMessage("Lastname must be 200 characters long"),

    check("trainerId")
    .exists().withMessage("TrainerId field is missing").bail()
    .notEmpty().withMessage("TrainerId is required").bail()
    .isMongoId().withMessage("TrainerId must be a valid Mongo ID"),

    check("studentIds")
    .isArray({ min: 1 }).withMessage("StudentIds must be a non-empty array").bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage("Each studentId must be a valid Mongo ID"),

    check("exerciseAssignment")
    .isArray({ min: 1 }).withMessage("ExerciseAssignments must be a non-empty array").bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage("Each ExerciseAssignment ID must be a valid Mongo ID"),

  check("muscleGroup")
    .exists().withMessage("Muscle group field is missing").bail()
    .notEmpty().withMessage("Muscle group is required").bail()
    .isString().withMessage("Muscle group must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Muscle group must be 3-50 characters long"),

  check("startDate")
    .optional()
    .isDate().withMessage("Start date must be a date").bail(),

  check("endDate")
    .optional()
    .isDate().withMessage("End date must be a date").bail(),

  check("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const updateRutineValidator = [
  check("name")
    .exists().withMessage("Name field is missing").bail()
    .notEmpty().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Name must be 3-50 characters long"),

  check("description")
    .optional()
    .isString().withMessage("Description must be a string").bail()
    .isLength({ max: 200 }).withMessage("Lastname must be 200 characters long"),

    check("trainerId")
    .exists().withMessage("TrainerId field is missing").bail()
    .notEmpty().withMessage("TrainerId is required").bail()
    .isMongoId().withMessage("TrainerId must be a valid Mongo ID"),

    check("studentIds")
    .isArray({ min: 1 }).withMessage("StudentIds must be a non-empty array").bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage("Each studentId must be a valid Mongo ID"),

    check("exerciseAssignment")
    .isArray({ min: 1 }).withMessage("ExerciseAssignments must be a non-empty array").bail()
    .custom((arr) => arr.every((id: string) => /^[a-fA-F0-9]{24}$/.test(id)))
    .withMessage("Each ExerciseAssignment ID must be a valid Mongo ID"),

  check("muscleGroup")
    .exists().withMessage("Muscle group field is missing").bail()
    .notEmpty().withMessage("Muscle group is required").bail()
    .isString().withMessage("Muscle group must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Muscle group must be 3-50 characters long"),

  check("startDate")
    .optional()
    .isDate().withMessage("Start date must be a date").bail(),

  check("endDate")
    .optional()
    .isDate().withMessage("End date must be a date").bail(),

  check("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getRutineValidator = [
  check("id")
    .exists().withMessage("ID parameter is missing").bail()
    .notEmpty().withMessage("ID parameter is required").bail()
    .isMongoId().withMessage("Invalid ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  getRutineValidator,
  updateRutineValidator,
  createRutineValidator
};