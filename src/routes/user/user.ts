import express from "express";
import controllers from "./controller";
import validator from "./userValidator";
import checkRol from "../../middlewares/checkRole";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";

const router = express.Router();

router.get("/", authenticateFirebase, checkRol(["admin", "profesor", "user"]), controllers.getAllUsers);
router.get("/:id", authenticateFirebase, checkRol(["admin", "profesor"]), validator.getUserValidator, controllers.getUserById);
router.put("/:id", authenticateFirebase, checkRol(["user", "admin", "profesor"]), validator.UpdateUserValidator, validator.getUserValidator ,controllers.updateUser);
router.delete('/hard/:id', checkRol(["admin"]), authenticateFirebase, validator.getUserValidator, controllers.hardDeleteUser);
router.patch('/soft/:id', authenticateFirebase, checkRol(["admin"]),validator.getUserValidator, controllers.softDeleteUser);
router.patch('/activate/:id',  authenticateFirebase, checkRol(["admin"]), validator.getUserValidator, controllers.activateUser);
router.patch('/setUserRole/:id', authenticateFirebase, checkRol(["admin", "user"]), validator.getUserValidator, controllers.setUserRole);

export default router;
