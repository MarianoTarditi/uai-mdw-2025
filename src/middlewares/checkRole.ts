import { Request, Response, NextFunction } from "express";
import handleHttpError from "../utils/handleError";

const checkRol =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user; // viene de authenticateFirebase

      if (!user) {
        return handleHttpError(res, "User not authenticated", 401);
      }

      const rolesByUser: string[] = user.roles || [];
      const hasRole = roles.some((rolSingle) => rolesByUser.includes(rolSingle));


      if (!hasRole) {
        return handleHttpError(res, "User does not have permissions", 403);
      }

      next();
    } catch (error) {
      handleHttpError(res, "Error permission role", 500);
    }
  };

export default checkRol;
