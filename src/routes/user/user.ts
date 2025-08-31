import express from "express";
import controllers from "./controller";

const router = express.Router();

router.post("/", controllers.createUser);
router.get("/", controllers.getUsers);
router.get("/:id", controllers.getUserById);
router.put("/:id", controllers.updateUser);
router.delete("/:id", controllers.deleteUser);

export default router;
