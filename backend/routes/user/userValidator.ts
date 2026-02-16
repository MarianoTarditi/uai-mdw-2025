import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const UpdateUserValidator = [
  check("name")
    .exists().withMessage("Name field is missing").bail()
    .notEmpty().withMessage("Name is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .isLength({ min: 3, max: 20 }).withMessage("Name must be 3-20 characters long"),

  check("lastName")
    .exists().withMessage("Lastname field is missing").bail()
    .notEmpty().withMessage("Lastname is required").bail()
    .isString().withMessage("Name must be a string").bail()
    .isLength({ min: 3, max: 50 }).withMessage("Lastname must be 3-50 characters long"),

  check("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be true or false")
    .toBoolean(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getUserValidator = [
  check("id")
    .exists().withMessage("ID parameter is missing").bail()
    .notEmpty().withMessage("ID parameter is required").bail()
    .isMongoId().withMessage("Invalid ID format"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  getUserValidator,
  UpdateUserValidator,
};