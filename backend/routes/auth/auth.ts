import express from "express";
import validator from ".//authValidator";
import controller from "./controller";

const router = express.Router();

router.post("/saveUser", validator.registerValidator, controller.saveUser);

export default router;