import express from "express";
import user from "./user/user";
import auth from "./auth/auth";

const router = express.Router();

router.use("/user", user);
router.use("/auth", auth);

export default router;
