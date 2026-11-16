
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

const router = Router();

router.post("/create", CreateFooterLinkMasterController);
router.get("/list", GetAllFooterLinkMasterController);
router.get("/:id", GetFooterLinkMasterByIdController);
router.put("/update/:id", UpdateFooterLinkMasterController);
router.delete("/delete/:id", DeleteFooterLinkMasterController);
router.patch("/status/:id", ChangeFooterLinkMasterActiveStatusController);
router.patch("/display-status/:id", ChangeFooterLinkMasterDisplayStatusController);

export default router;
