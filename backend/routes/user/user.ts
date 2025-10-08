import express from "express";
import controllers from "./controller";
import validator from "./userValidator";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";
import {UserRole} from "../../types"

const router = express.Router();

router.get("/", authenticateFirebase, controllers.getAllUsers);
router.get("/:id", authenticateFirebase, checkRol([UserRole.Student]), validator.getUserValidator, controllers.getUserById);
router.put("/:id", authenticateFirebase, checkRol([UserRole.Student]), validator.UpdateUserValidator, validator.getUserValidator ,controllers.updateUser);
router.delete('/hard/:id', checkRol([UserRole.Student]), authenticateFirebase, validator.getUserValidator, controllers.hardDeleteUser);
router.patch('/soft/:id', authenticateFirebase, checkRol([UserRole.Student]),validator.getUserValidator, controllers.softDeleteUser);
router.patch('/activate/:id',  authenticateFirebase, checkRol([UserRole.Student]), validator.getUserValidator, controllers.activateUser);
router.patch('/setUserRole/:id', authenticateFirebase, checkRol([UserRole.Student]), validator.getUserValidator, controllers.setUserRole);

export default router;