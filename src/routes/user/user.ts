import express from "express";
import controllers from "./controller";
import validator from "./userValidator";
import authMiddleware from "../../middlewares/session";
import checkRol from "../../middlewares/rol";

const router = express.Router();

router.get("/", authMiddleware, controllers.getAllUsers);
router.get("/:id", authMiddleware, validator.getUserValidator, controllers.getUserById);
router.put("/:id", authMiddleware, validator.UpdateUserValidator, validator.getUserValidator ,controllers.updateUser);
router.delete('/hard/:id', authMiddleware, checkRol(["user"]), validator.getUserValidator, controllers.hardDeleteUser);
router.patch('/soft/:id', authMiddleware, checkRol(["user"]), validator.getUserValidator, controllers.softDeleteUser);
router.patch('/activate/:id', authMiddleware, checkRol(["user"]), validator.getUserValidator, controllers.activateUser);


export default router;
