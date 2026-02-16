import express from "express";
import controllers from "./controller";
import validator from "./userValidator";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import { UserRole } from "../../types";
import { uploadProfileImage } from "../../utils/multer";

const router = express.Router();

router.get(
  "/",
  authenticateFirebase,
  checkRol([UserRole.Admin, UserRole.Trainer]),
  controllers.getAllUsers,
);

router.get(
  "/profile",
  authenticateFirebase,
  controllers.getProfile,
);

router.get(
  "/:id",
  authenticateFirebase,
  checkRol([UserRole.Admin, UserRole.Trainer]),
  controllers.getUserById,
);

router.put(
  "/:id",
  authenticateFirebase,
  uploadProfileImage.single("profileImage"),
  validator.UpdateUserValidator,
  validator.getUserValidator,
  checkRol([UserRole.Admin, UserRole.Trainer, UserRole.Student]),
  controllers.updateUser,
);

router.patch(
  "/soft/:id",
  authenticateFirebase,
  validator.getUserValidator,
  checkRol([UserRole.Admin]),
  controllers.softDeleteUser,
);

router.patch(
  "/activate/:id",
  authenticateFirebase,
  validator.getUserValidator,
  checkRol([UserRole.Admin]),
  controllers.activateUser,
);

router.patch(
  "/setUserRole/:id",
  authenticateFirebase,
  validator.getUserValidator,
  checkRol([UserRole.Admin]),
  controllers.setUserRole,
);

export default router;
