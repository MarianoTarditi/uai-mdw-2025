import { check, param, query } from "express-validator";
import validateResults from "../../utils/handleValidator";
import { Request, Response, NextFunction } from "express";

const registerValidator = [
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
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters long"),

  check("password")
    .exists()
    .withMessage("Password field is missing")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .bail(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const loginValidator = [
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

  check("password")
    .exists()
    .withMessage("Password field is missing")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .bail(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  loginValidator,
  registerValidator,
};
