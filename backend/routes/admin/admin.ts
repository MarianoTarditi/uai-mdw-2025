import express from "express";
import controller from "./controller";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import checkRole from "../../middlewares/checkRole";
import { UserRole } from "../../types";

const router = express.Router();

router.get(
  "/dashboard",
  authenticateFirebase,
  checkRole([UserRole.Admin]),
  controller.getDashboardStats,
);
router.get(
  "/chartData",
  authenticateFirebase,
  checkRole([UserRole.Admin]),
  controller.getChartData,
);
router.get(
  "/auditLogs",
  authenticateFirebase,
  checkRole([UserRole.Admin]),
  controller.getAuditLogs,
);

export default router;
