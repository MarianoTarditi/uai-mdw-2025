import express from "express";
import user from "./user/user";
import auth from "./auth/auth";
import exercise from "./exercise/exercise";
import routine from "./routine/routine";
import admin from "./admin/admin";
import { requestContext } from "../utils/requestContext";
import { authenticateFirebase } from "../middlewares/authenticateFirebase";
import User from "../models/User"; // Asegúrate de ajustar esta ruta

const router = express.Router();

const contextMiddleware = async (req: any, res: any, next: any) => {
  try {
    let contextUser = null;

    if (req.user && req.user.email) {
      // 🔥 Buscamos el usuario en Mongo UNA SOLA VEZ por cada petición
      const mongoUser = await User.findOne({ email: req.user.email }).lean();
      
      if (mongoUser) {
        contextUser = mongoUser; // Tiene el _id, name, lastName, etc.
      } else {
        // Si no está en Mongo (ej: en medio del registro), usamos el de Firebase
        contextUser = req.user;
      }
    } else {
      console.log("No hay req.user en contextMiddleware (Petición pública o sin token)");
    }

    // 🔥 SIEMPRE envolvemos el next(), haya o no haya usuario
    requestContext.run({ user: contextUser }, () => {
      next();
    });
  } catch (error) {
    console.error("Error en contextMiddleware:", error);
    // Si la BD falla, dejamos que la petición continúe con contexto vacío
    requestContext.run({ user: null }, () => {
      next();
    });
  }
};

router.use("/auth", auth); 
router.use(authenticateFirebase);
router.use(contextMiddleware);

router.use("/user", user);
router.use("/exercise", exercise);
router.use("/routines", routine);
router.use("/admin", admin);

export default router;
