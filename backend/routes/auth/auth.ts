import express from "express";
import validator from ".//authValidator";
import controller from "./controller";

const router = express.Router();

router.post("/signUp", validator.registerValidator, controller.signUp);
router.post("/login", validator.loginValidator, controller.login); // Sign in wth email and password

export default router;