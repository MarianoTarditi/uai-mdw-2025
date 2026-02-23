import express from "express";
import controllers from "./controller";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import checkRole from "../../middlewares/checkRole";
import { UserRole } from "../../types";

const router = express.Router();

router.get(
  "/students",
  authenticateFirebase,
  checkRole([UserRole.Trainer]),
  controllers.getStudents,
);

router.get(
  "/",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student]),
  controllers.getAllRoutines,
);
router.get(
  "/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer, UserRole.Student]),
  controllers.getRoutineById,
);


router.post(
  "/",
  authenticateFirebase,
  checkRole([UserRole.Trainer]),
  controllers.createRoutine,
);

router.put(
  "/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer]),
  controllers.updateRoutine,
);
router.delete(
  "/:id",
  authenticateFirebase,
  checkRole([UserRole.Trainer]),
  controllers.deleteRoutine,
);

export default router;