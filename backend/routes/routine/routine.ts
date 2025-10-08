import express from "express";
import controllers from "./controller";
// import validator from "./exerciseValidation";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {UserRole} from "../../types"

const router = express.Router();

router.post("/", controllers.createRoutine);
router.get("/", controllers.getAllRoutines);
router.get("/:id", controllers.getRoutineById);
router.put("/:id", controllers.updateRoutine);
router.delete('/:id', controllers.hardDeleteRoutine);

export default router;