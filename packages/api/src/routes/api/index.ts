import { Router } from "express";
import authRouter from "./auth.route";
import meRouter from "./me.route";
import userRouter from "./user.route";

const router = Router();

router.use("/me", meRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
