import { Router } from "express";
import FlagController from "../../controllers/flag.controller";
import stripRouter from "./strip.route";

const router = Router();

router.param("flagUid", FlagController.applyFlagToRequestByUidParam);
router.get("/", FlagController.getFlags);
router.get("/:flagUid", FlagController.getFlagByUid);
router.post("/", FlagController.postFlag);
router.patch("/:flagUid", FlagController.patchFlag);
router.delete("/:flagUid", FlagController.deleteFlag);

router.use("/:flagUid/strips", stripRouter);

export default router;
