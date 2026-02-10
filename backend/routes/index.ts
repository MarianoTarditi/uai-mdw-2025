import express from "express";
import user from "./user/user";
import auth from "./auth/auth";
import exercise from "./exercise/exercise";
import routine from "./routine/routine";

const router = express.Router();

router.use("/user", user);
router.use("/auth", auth);
router.use("/exercise", exercise);
router.use("/routines", routine);

export default router;
