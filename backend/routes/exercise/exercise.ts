import express from "express";
import controllers from "./controller";
import validator from "./exerciseValidation";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {UserRole} from "../../types"
import {uploadExerciseVideo} from "../../utils/multer";
import {parseMultipartBody} from "../../middlewares/parseMultipart";

const router = express.Router();

router.post("/", uploadExerciseVideo.single("video"), parseMultipartBody, validator.CreateExerciseValidator, controllers.createExercise);
router.get("/", controllers.getAllExercises);
router.get("/:id", validator.getExerciseValidator, controllers.getExerciseById);
router.put("/:id", uploadExerciseVideo.single("video"), parseMultipartBody, validator.getExerciseValidator, validator.UpdateExerciseValidator, controllers.updateExercise);
router.delete('/:id', validator.getExerciseValidator, controllers.hardDeleteExercise);

export default router;