import express from "express";
import controllers from "./controller";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase"; // <--- Importar
import {UserRole} from "../../types"

const router = express.Router();

router.post("/", authenticateFirebase, controllers.createRoutine);
router.get("/", authenticateFirebase, controllers.getAllRoutines); 
router.get("/:id", authenticateFirebase, controllers.getRoutineById);
router.put("/:id", authenticateFirebase, controllers.updateRoutine);
router.delete('/:id', authenticateFirebase, controllers.deleteRoutine);

export default router;