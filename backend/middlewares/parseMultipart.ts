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
        req.body[field] = JSON.parse(req.body[field]);
      } catch (error) {
        req.body[field] = [];
      }
    }
  });

  next();
};