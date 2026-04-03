import express from "express";
import controllers from "./controller";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import checkRole from "../../middlewares/checkRole";
import { UserRole } from "../../types";
import { uploadRoutineTemplate } from "../../utils/multer";

const router = express.Router();

router.get(
  "/students",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.getStudents,
);

router.get(
  "/templates",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin, UserRole.Student]),
  controllers.getRoutineTemplates,
);

router.post(
  "/templates",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  uploadRoutineTemplate.single("template"),
  controllers.uploadRoutineTemplateFile,
);

router.delete(
  "/templates/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.deleteRoutineTemplateFile,
);

router.patch(
  "/templates/:id/title",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.renameRoutineTemplateFile,
);

router.get(
  "/",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student, UserRole.Admin]),
  controllers.getAllRoutines,
);
router.get(
  "/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student, UserRole.Admin]),
  controllers.getRoutineById,
);


router.post(
  "/",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.createRoutine,
);

router.put(
  "/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.updateRoutine,
);
router.delete(
  "/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Admin]),
  controllers.deleteRoutine,
);

export default router;
