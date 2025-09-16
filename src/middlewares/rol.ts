import { Request, Response, NextFunction } from "express";
import handleHttpError from "../utils/handleError";


const checkRol = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user; // viene cargado desde authMiddleware

      if (!user) {
        handleHttpError(res, "User not authenticated", 401);
        return;
      }

      const rolesByUser = user.role; // ['user'], ['admin']
      const hasRole = roles.some((rolSingle) => rolesByUser.includes(rolSingle)); // Verifica si el usuario tiene al menos uno de los roles requeridos, de los que pasamos en el array

      if (!hasRole) {
        handleHttpError(res, "User does not have permissions", 403);
        return;
      }

      next();
    } catch (error) {
      handleHttpError(res, "Error permission role", 500);
    }
  };


/*
const checkRol =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;
      
      const rolesByUser = user.role; // ['user'], ['admin'], ['superadmin']
      const hasRole = roles.some((rolSingle) => rolesByUser.includes(rolSingle));

      if(!hasRole)
      {
        handleHttpError(res, "User does not have permissions", 403);
        return;
      }
      next();
    } catch (error) {
      handleHttpError(res, "Error permission role", 500);
      console.log(error);
    }
  };

  */

export default checkRol;
