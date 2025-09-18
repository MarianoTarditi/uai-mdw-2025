import { Request, Response, NextFunction } from "express";
import admin from "../utils/firebase";
import handleHttpError from "../utils/handleError";
import User from "../models/User";

// export const authenticateFirebase = async (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     (req as any).firebaseUser = decodedToken;

//     next();
//   } catch (error) {
//     return handleHttpError(res, "Invalid or expired token", 401);
//   }
// };

export const authenticateFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid }); // Buscar usuario en Mongo por UID de Firebase

    if (!user) {
      handleHttpError(res, "User not found in the database", 404);
      return;
    }

    res.locals.user = {
      // Guardamos user completo (con roles) en res.locals
      ...decodedToken,
      roles: user.roles,
      _id: user._id,
      email: user.email,
    };

    next();
  } catch (error) {
    return handleHttpError(res, "Invalid or expired token", 401);
  }
};
