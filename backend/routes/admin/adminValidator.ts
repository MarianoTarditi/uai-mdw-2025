import { check } from "express-validator";
import { NextFunction, Request, Response } from "express";
import validateResults from "../../middlewares/handleValidator";
import {
  ARGENTINA_PHONE_EXAMPLE,
  isValidArgentinaPhone,
  normalizeArgentinaPhone,
} from "../../utils/phoneAr";

const dateRegex = /^([0-2]?\d|3[01])\/([0]?\d|1[0-2])\/(19|20)\d{2}$/;

const createManagedUserValidator = [
  check("name")
    .exists().withMessage("El campo nombre no existe").bail()
    .notEmpty().withMessage("El nombre es requerido").bail()
    .isString().withMessage("El nombre debe ser una cadena de texto").bail()
    .isLength({ min: 2, max: 30 }).withMessage("El nombre debe tener entre 2 y 30 caracteres"),
  check("lastName")
    .exists().withMessage("El campo apellido no existe").bail()
    .notEmpty().withMessage("El apellido es requerido").bail()
    .isString().withMessage("El apellido debe ser una cadena de texto").bail()
    .isLength({ min: 2, max: 30 }).withMessage("El apellido debe tener entre 2 y 30 caracteres"),
  check("email")
    .exists().withMessage("El campo email no existe").bail()
    .notEmpty().withMessage("El email es requerido").bail()
    .isEmail().withMessage("El formato del email es invalido").bail(),
  check("phone")
    .exists().withMessage("El campo telefono no existe").bail()
    .notEmpty().withMessage("El telefono es requerido").bail()
    .isString().withMessage("El telefono debe ser una cadena de texto").bail()
    .custom((value) => isValidArgentinaPhone(String(value)))
    .withMessage(`Ingresa un celular argentino valido, por ejemplo ${ARGENTINA_PHONE_EXAMPLE}`).bail()
    .customSanitizer((value) => normalizeArgentinaPhone(String(value)) ?? value),
  check("birthDate")
    .optional({ values: "falsy" })
    .isString().withMessage("La fecha de nacimiento debe ser texto").bail()
    .custom((value) => dateRegex.test(value)).withMessage("Formato de fecha invalido (DD/MM/AAAA)"),
  check("gender")
    .optional({ values: "falsy" })
    .isIn(["male", "female", "other"]).withMessage("Genero invalido"),
  check("height")
    .optional({ values: "falsy" })
    .isFloat({ min: 100, max: 250 }).withMessage("Ingresa una altura valida (100-250 cm)"),
  check("weight")
    .optional({ values: "falsy" })
    .isFloat({ min: 20, max: 150 }).withMessage("Ingresa un peso valido (20-150 kg)")
    .toFloat(),
  check("paymentAmount")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("El monto del pago debe ser un numero valido mayor o igual a 0")
    .toFloat(),
  check("paymentBillingCycleDays")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 365 })
    .withMessage("El ciclo de pago debe ser un entero entre 1 y 365 dias")
    .toInt(),
  check("paymentStartDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha de inicio de pago debe ser valida"),
  check("paymentDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("La fecha de pago debe ser valida"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  createManagedUserValidator,
};
