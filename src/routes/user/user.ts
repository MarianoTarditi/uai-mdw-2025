import express from "express";
import controllers from "./controller";
import validator from "./userValidator";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";

const router = express.Router();

router.get("/", authenticateFirebase, controllers.getAllUsers);
router.get("/:id", authenticateFirebase, validator.getUserValidator, controllers.getUserById);
router.put("/:id", authenticateFirebase, validator.UpdateUserValidator, validator.getUserValidator ,controllers.updateUser);
router.delete('/hard/:id', authenticateFirebase, validator.getUserValidator, controllers.hardDeleteUser);
router.patch('/soft/:id', authenticateFirebase, validator.getUserValidator, controllers.softDeleteUser);
router.patch('/activate/:id', authenticateFirebase, validator.getUserValidator, controllers.activateUser);


export default router;
