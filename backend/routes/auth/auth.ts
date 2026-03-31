import express from "express";
import validator from ".//authValidator";
import controller from "./controller";
import { authenticateFirebase } from "../../middlewares/authenticateFirebase";

const router = express.Router();

router.post("/saveUser", authenticateFirebase, validator.registerValidator, controller.saveUser);

export default router;
