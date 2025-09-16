import express from "express";
import validator from ".//authValidator";
import controller from "./controller";

const router = express.Router();

router.post("/register", validator.registerValidator, controller.register);
router.post("/login", validator.loginValidator, controller.login);

export default router;
