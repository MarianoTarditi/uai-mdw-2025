import { check } from "express-validator";
import validateResults from "../../middlewares/handleValidator";
import { Request, Response, NextFunction } from "express";

const registerValidator = [
  check("name")
    .exists().withMessage("El campo nombre no existe").bail()
    .notEmpty().withMessage("El nombre es requerido").bail()
    .isString().withMessage("El nombre debe ser una cadena de texto").bail()
    .isLength({ min: 3, max: 30 }).withMessage("El nombre debe tener entre 3 y 30 caracteres"),

  check("lastName")
    .exists().withMessage("El campo apellido no existe").bail()
    .notEmpty().withMessage("El apellido es requerido").bail()
    .isString().withMessage("El apellido debe ser una cadena de texto").bail()
    .isLength({ min: 3, max: 30 }).withMessage("El apellido debe tener entre 3 y 30 caracteres"),

  check("email")
    .exists().withMessage("El campo email no existe").bail()
    .notEmpty().withMessage("El email es requerido").bail()
    .isEmail().withMessage("El formato del email es inválido").bail()
    .isString().withMessage("El email debe ser una cadena de texto").bail()
    .isLength({ min: 3, max: 100 }).withMessage("El email debe tener entre 3 y 100 caracteres"),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

const loginValidator = [
  check("email")
    .exists().withMessage("El campo email no existe").bail()
    .notEmpty().withMessage("El email es requerido").bail()
    .isEmail().withMessage("El formato del email es inválido").bail()
    .isString().withMessage("El email debe ser una cadena de texto").bail(),

  check("password")
    .exists().withMessage("El campo contraseña no existe").bail()
    .notEmpty().withMessage("La contraseña es requerida").bail(),

  (req: Request, res: Response, next: NextFunction) => {
    validateResults(req, res, next);
  },
];

export default {
  loginValidator,
  registerValidator,
};