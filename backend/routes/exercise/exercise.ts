import express from "express";
import controllers from "./controller";
import validator from "./exerciseValidation";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {UserRole} from "../../types"
import {uploadExerciseVideo} from "../../utils/multer";
import {parseMultipartBody} from "../../middlewares/parseMultipart";

const router = express.Router();

router.post("/", authenticateFirebase, uploadExerciseVideo.single("video"), parseMultipartBody, validator.CreateExerciseValidator, controllers.createExercise);
router.get("/", authenticateFirebase, controllers.getAllExercises);
router.get("/:id", authenticateFirebase, validator.getExerciseValidator, controllers.getExerciseById);
router.put("/:id", authenticateFirebase, uploadExerciseVideo.single("video"), parseMultipartBody, validator.getExerciseValidator, validator.UpdateExerciseValidator, controllers.updateExercise);
router.delete('/:id', authenticateFirebase, validator.getExerciseValidator, controllers.deleteExercise);

export default router;