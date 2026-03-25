import express from "express";
import controllers from "./controller";
import validator from "./progrssValidation";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import checkRole from "../../middlewares/checkRole";
import { UserRole } from "../../types";

const router = express.Router();

router.get(
  "/my",
  authenticateFirebase,
  checkRole([UserRole.Student, UserRole.Trainer, UserRole.Admin]),
  controllers.getMyProgress,
);

router.get(
  "/students/summary",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.getStudentsProgressSummary,
);

router.get(
  "/student/:studentId",
  authenticateFirebase,
  validator.getStudentProgressValidator,
  checkRole([UserRole.Student, UserRole.Trainer, UserRole.Admin]),
  controllers.getStudentProgress,
);

router.post(
  "/student/:studentId",
  authenticateFirebase,
  validator.getStudentProgressValidator,
  validator.createProgressValidator,
  checkRole([UserRole.Student, UserRole.Trainer, UserRole.Admin]),
  controllers.createProgressEntry,
);

export default router;
