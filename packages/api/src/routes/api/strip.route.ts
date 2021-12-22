import { Router } from "express";
import StripController from "../../controllers/strip.controller";

const router = Router();

router.get("/image-options", StripController.getStripImageOptions);

router.param("stripId", StripController.applyStripToRequestByIdParam);
router.get("/", StripController.getStrips);
router.get("/:stripId", StripController.getStripById);
router.post("/", StripController.postStrip);
router.patch("/:stripId", StripController.patchStrip);
router.delete("/:stripId", StripController.deleteStrip);

export default router;
