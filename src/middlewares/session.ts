import handleHttpError from "../utils/handleError";
import { Request, Response, NextFunction } from "express";
import handleJwt from "../utils/handleJwt";
import User from "../models/User";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      handleHttpError(res, "You need to login ", 401);
    }

    const token = req.headers.authorization?.split(" ").pop(); // "omite la palabra bearer en el token"

    if (!token) {
      handleHttpError(res, "No token provided", 401);
      return;
    }

    const dataToken = await handleJwt.verifyToken(token); // función que verifica el token y devuelve el payload decodificado

    if(!dataToken || !dataToken._id){
      handleHttpError(res, "Invalid ID-User token", 401);
      return;
    }

    const user = await User.findById(dataToken._id); // busca el usuario en la base de datos por su ID

    res.locals.user = user; // guarda el usuario en res.locals para que esté disponible en los siguientes middlewares/controladores
    next();

  } catch (error) {
    handleHttpError(res, "Session error", 401);
  }
};

export default authMiddleware;
