import express from "express";
import controllers from "./controller";
import validator from "./userValidator";
import authMiddleware from "../../middlewares/session";
import checkRol from "../../middlewares/rol";

const router = express.Router();

router.get("/", controllers.getAllUsers);
router.get("/:id", validator.getUserValidator, controllers.getUserById);
router.put("/:id", validator.UpdateUserValidator, validator.getUserValidator ,controllers.updateUser);
router.delete('/hard/:id', checkRol(["admin"]), validator.getUserValidator, controllers.hardDeleteUser);
router.patch('/soft/:id', validator.getUserValidator, controllers.softDeleteUser);
router.patch('/activate/:id', validator.getUserValidator, controllers.activateUser);


export default router;
