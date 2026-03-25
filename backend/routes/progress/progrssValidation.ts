import { check } from "express-validator";
import { Request, Response, NextFunction } from "express";
import validateResults from "../../middlewares/handleValidator";

const createProgressValidator = [
  check("routineId")
    .exists()
    .withMessage("routineId is required")
    .bail()
    .isMongoId()
    .withMessage("routineId must be a valid Mongo ID"),
  check("exerciseId")
    .exists()
    .withMessage("exerciseId is required")
    .bail()
    .isMongoId()
    .withMessage("exerciseId must be a valid Mongo ID"),
  check("date")
    .optional()
    .isISO8601()
    .withMessage("date must be a valid date"),
  check("weightUsed")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("weightUsed must be a positive number"),
  check("notes")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage("notes must be a string up to 500 chars"),
  check("completedSets")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("completedSets must be a positive integer"),
  check("completedReps")
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage("completedReps must be a positive integer"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getStudentProgressValidator = [
  check("studentId")
    .exists()
    .withMessage("studentId is required")
    .bail()
    .isMongoId()
    .withMessage("studentId must be a valid Mongo ID"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  createProgressValidator,
  getStudentProgressValidator,
};
