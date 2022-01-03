import { Router } from "express";
import StripController from "../../controllers/strip.controller";

const router = Router();

router.get("/image-options", StripController.getStripImageOptions);
router.get("/image-options/:stripImageOptionUid", StripController.getStripImageOptionByUid);

router.param("stripUid", StripController.applyStripToRequestByUidParam);
router.param("stripImageOptionUid", StripController.applyStripImageOptionToRequestByUidParam);
router.get("/", StripController.getStrips);
router.get("/:stripUid", StripController.getStripByUid);
router.post("/", StripController.postStrip);
router.patch("/:stripUid", StripController.patchStrip);
router.delete("/:stripUid", StripController.deleteStrip);

export default router;
