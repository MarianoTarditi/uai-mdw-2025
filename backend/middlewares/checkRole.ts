import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { UserRole } from "../types";

const checkRole = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const firebaseUser = (req as any).user;

      if (!firebaseUser?.uid) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const user = await User.findOne({ firebaseUid: firebaseUser.uid });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const hasAccess = user.roles.some((role) =>
        allowedRoles.includes(role as UserRole),
      );

      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "Acceso denegado. No tiene los roles requeridos." });
      }

      (req as any).dbUser = user;

      next();
    } catch (error) {
      console.error("CHECK ROLE ERROR:", error);
      return res.status(500).json({ message: "Error checking user role" });
    }
  };
};

export default checkRole;
