
import { Router } from "express";

import {
    CreateFooterLinkMasterController,
    GetAllFooterLinkMasterController,
    GetFooterLinkMasterByIdController,
    UpdateFooterLinkMasterController,
    DeleteFooterLinkMasterController,
    ChangeFooterLinkMasterActiveStatusController,
    ChangeFooterLinkMasterDisplayStatusController
} from "../controller/footerLinkController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create", adminSessionMiddleware, CreateFooterLinkMasterController);
router.get("/list", GetAllFooterLinkMasterController);
router.get("/:id", GetFooterLinkMasterByIdController);
router.put("/update/:id", adminSessionMiddleware, UpdateFooterLinkMasterController);
router.delete("/delete/:id", adminSessionMiddleware, DeleteFooterLinkMasterController);
router.patch("/status/:id", adminSessionMiddleware, ChangeFooterLinkMasterActiveStatusController);
router.patch("/display-status/:id", adminSessionMiddleware, ChangeFooterLinkMasterDisplayStatusController);

export default router;
