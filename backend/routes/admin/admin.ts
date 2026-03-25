import express from "express";
import controller from "./controller";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import checkRole from "../../middlewares/checkRole";
import { UserRole } from "../../types";

const router = express.Router();

router.get(
  "/dashboard",
  authenticateFirebase,
  checkRole([UserRole.Admin, UserRole.Trainer]),
  controller.getDashboardStats,
);
router.get(
  "/chartData",
  authenticateFirebase,
  checkRole([UserRole.Admin, UserRole.Trainer]),
  controller.getChartData,
);
router.get(
  "/auditLogs",
  authenticateFirebase,
  checkRole([UserRole.Admin, UserRole.Trainer]),
  controller.getAuditLogs,
);

export default router;
