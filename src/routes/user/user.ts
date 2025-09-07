import express from "express";
import controllers from "./controller";
import validator from "./userValidator";

const router = express.Router();

router.post("/", validator.createUserValidator, controllers.createUser);
router.get("/", controllers.getAllUsers);
router.get("/:id", validator.getUserValidator, controllers.getUserById);
router.put("/:id", validator.UpdateUserValidator, validator.getUserValidator ,controllers.updateUser);
router.delete('/hard/:id', validator.getUserValidator, controllers.hardDeleteUser);
router.patch('/soft/:id', validator.getUserValidator, controllers.softDeleteUser);
router.patch('/activate/:id', validator.getUserValidator, controllers.activateUser);


export default router;
