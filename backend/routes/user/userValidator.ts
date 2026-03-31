import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";
import {
  ARGENTINA_PHONE_EXAMPLE,
  isValidArgentinaPhone,
  normalizeArgentinaPhone,
} from "../../utils/phoneAr";

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

  check("phone")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("phone must be a string")
    .bail()
    .custom((value) => isValidArgentinaPhone(String(value)))
    .withMessage(
      `phone must be a valid Argentinian mobile number, for example ${ARGENTINA_PHONE_EXAMPLE}`,
    )
    .bail()
    .customSanitizer((value) => normalizeArgentinaPhone(String(value)) ?? value),

  check("weight")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 20, max: 150 })
    .withMessage("weight must be between 20 and 150 kg")
    .toFloat(),

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

const updateStudentPaymentValidator = [
  check("startDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("startDate must be a valid date"),

  check("amount")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("amount must be a positive number"),

  check("paymentDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("paymentDate must be a valid date"),

  check("isPaid")
    .optional()
    .isBoolean()
    .withMessage("isPaid must be true or false")
    .toBoolean(),

  check("billingCycleDays")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 365 })
    .withMessage("billingCycleDays must be an integer between 1 and 365"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const paymentReminderValidator = [
  check("channel")
    .exists()
    .withMessage("channel is required")
    .bail()
    .isIn(["email", "whatsapp"])
    .withMessage("channel must be 'email' or 'whatsapp'"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  getUserValidator,
  UpdateUserValidator,
  updateStudentPaymentValidator,
  paymentReminderValidator,
};
