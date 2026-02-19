import express from "express";
import controllers from "./controller";
import validator from "./exerciseValidation";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import { UserRole } from "../../types";
import { uploadExerciseVideo } from "../../utils/multer";
import { parseMultipartBody } from "../../middlewares/parseMultipart";
import checkRole from "../../middlewares/checkRole";

const router = express.Router();

router.post(
  "/",
  authenticateFirebase,
  uploadExerciseVideo.single("video"),
  parseMultipartBody,
  validator.CreateExerciseValidator,
  checkRole([UserRole.Trainer]),
  controllers.createExercise,
);
router.get(
  "/",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student]),
  controllers.getAllExercises,
);
router.get(
  "/:id",
  authenticateFirebase,
  validator.getExerciseValidator,
  checkRole([UserRole.Trainer, UserRole.Student]),
  controllers.getExerciseById,
);
router.put(
  "/:id",
  authenticateFirebase,
  uploadExerciseVideo.single("video"),
  parseMultipartBody,
  validator.getExerciseValidator,
  validator.UpdateExerciseValidator,
  checkRole([UserRole.Trainer]),
  controllers.updateExercise,
);
router.delete(
  "/:id",
  authenticateFirebase,
  validator.getExerciseValidator,
  checkRole([UserRole.Trainer]),
  controllers.deleteExercise,
);

export default router;
