import express from "express";
import validator from ".//authValidator";
import controller from "./controller";

const router = express.Router();

router.post("/register", validator.registerValidator, controller.registerUser);
router.post("/login", validator.loginValidator, controller.login); // Sign in wth email and password

export default router;
