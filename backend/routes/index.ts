import express from "express";
import user from "./user/user";
import auth from "./auth/auth";
import exercise from "./exercise/exercise";
import routine from "./routine/routine";
import admin from "./admin/admin";
import { requestContext } from "../utils/requestContext";
import { authenticateFirebase } from "../middlewares/authenticateFirebase";
import User from "../models/User"; 

const router = express.Router();

const contextMiddleware = async (req: any, res: any, next: any) => {
  try {
    let contextUser = null;

    if (req.user && req.user.email) {
      const mongoUser = await User.findOne({ email: req.user.email }).lean();

      if (mongoUser) {
        contextUser = mongoUser;
      } else {
        contextUser = req.user;
      }
    } else {
      console.log(
        "No hay req.user en contextMiddleware",
      );
    }

    requestContext.run({ user: contextUser }, () => {
      next();
    });
  } catch (error) {
    console.error("Error en contextMiddleware:", error);
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
