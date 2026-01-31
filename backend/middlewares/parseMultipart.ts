import { Request, Response, NextFunction } from "express";

export const parseMultipartBody = (req: Request, res: Response, next: NextFunction) => {
  // Lista de campos que sabemos que vienen como JSON string desde el FormData
  const arrayFields = [
    "etiquetas", 
    "musculosPrincipales", 
    "musculosSecundarios", 
    "materialesNecesarios"
  ];

  arrayFields.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
        // Convertimos "['a','b']" -> ['a','b']
        req.body[field] = JSON.parse(req.body[field]);
      } catch (error) {
        // Si falla, lo dejamos como array vacío o lo ignoramos
        req.body[field] = [];
      }
    }
  });

  next();
};