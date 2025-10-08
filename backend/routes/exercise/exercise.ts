import express from "express";
import controllers from "./controller";
import validator from "./exerciseValidation";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {UserRole} from "../../types"

const router = express.Router();

router.post("/", validator.CreateExerciseValidator, controllers.createExercise);
router.get("/", controllers.getAllExercises);
router.get("/:id", validator.getExerciseValidator, controllers.getExerciseById);
router.put("/:id", validator.getExerciseValidator, validator.UpdateExerciseValidator, controllers.updateExercise);
router.delete('/:id', validator.getExerciseValidator, controllers.hardDeleteExercise);

export default router;