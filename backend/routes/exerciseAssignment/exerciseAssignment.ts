import express from "express";
import controllers from "./controller";
// import validator from "./exerciseValidation";

const router = express.Router();

router.post("/", controllers.createExerciseAssignment);
router.get("/", controllers.getAllExerciseAssignment);
router.get("/:id", controllers.getExerciseAssignmentById);
router.put("/:id", controllers.updateExerciseAssignment);
router.delete('/:id', controllers.hardDeleteExerciseAssignment);

export default router;