import { check, param, query } from "express-validator";
import validateResults from "../../utils/handleValidator";
import { Request, Response, NextFunction } from "express";
import User from "../../models/User";

const createUserValidator = [
  check("name")
    .exists()
    .withMessage("Name field is missing")
    .bail()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3-20 characters long"),

  check("lastName")
    .exists()
    .withMessage("Lastname field is missing")
    .bail()
    .notEmpty()
    .withMessage("Lastname is required")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Lastname must be 3-20 characters long"),

  check("email")
    .exists()
    .withMessage("Email field is missing")
    .bail()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters long"),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false")
    .toBoolean(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const UpdateUserValidator = [
  check("name")
    .exists()
    .withMessage("Name field is missing")
    .bail()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3-20 characters long"),

  check("lastName")
    .exists()
    .withMessage("Lastname field is missing")
    .bail()
    .notEmpty()
    .withMessage("Lastname is required")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Lastname must be 3-20 characters long"),

  check("email")
    .exists()
    .withMessage("Email field is missing")
    .bail()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 50 }),

  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false")
    .toBoolean(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const getUserValidator = [
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
  createUserValidator,
  getUserValidator,
  UpdateUserValidator,
};
