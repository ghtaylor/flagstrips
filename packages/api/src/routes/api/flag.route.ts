import { Router } from "express";
import FlagController from "../../controllers/flag.controller";
import stripRouter from "./strip.route";

const router = Router();

router.param("flagId", FlagController.applyFlagToRequestByIdParam);
router.get("/", FlagController.getFlags);
router.get("/:flagId", FlagController.getFlagById);
router.post("/", FlagController.postFlag);
router.patch("/:flagId", FlagController.patchFlag);
router.delete("/:flagId", FlagController.deleteFlag);

router.use("/:flagId/strips", stripRouter);

export default router;
