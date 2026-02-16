import { Request, Response, NextFunction } from "express";
import admin from "../utils/firebase";
import User from "../models/User";


export const authenticateFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        code: 401,
        message: "Ningún token proporcionado",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    (req as any).user = decodedToken;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      error: true,
      code: 401,
      message: "Usuario no autenticado",
    });
  }
};
