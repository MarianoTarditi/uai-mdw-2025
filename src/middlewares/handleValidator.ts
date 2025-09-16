import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validateResults = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next(); // No hay errores, continua con el siguiente middleware o controlador
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Ocurrió un error inesperado al validar los datos.",
    });
  }
};

export default validateResults;
