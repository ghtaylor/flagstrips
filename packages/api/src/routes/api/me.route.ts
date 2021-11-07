import { Router } from "express";
import UserController from "../../controllers/user.controller";
import authenticate from "../../middleware/authenticate";
import flagRouter from "./flag.route";
import stripRouter from "./strip.route";

const router = Router();

router.get("/", authenticate, UserController.getAuthenticatedUser);

router.use("/flags", authenticate, flagRouter);
router.use("/strips", authenticate, stripRouter);

export default router;
