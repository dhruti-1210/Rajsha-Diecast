import { Router } from "express";

import {
    CreateFooterLinkGroupController,
    GetAllFooterLinkGroupController,
    GetFooterLinkGroupByIdController,
    UpdateFooterLinkGroupController,
    DeleteFooterLinkGroupController,
    ChangeFooterLinkGroupActiveStatusController,
    ChangeFooterLinkGroupDisplayStatusController
} from "../controller/footerLinkGroupController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

// Create Footer Link Group
router.post("/create", adminSessionMiddleware, CreateFooterLinkGroupController);

// Get All Footer Link Groups (supports pagination/search via query params)
router.get("/list", GetAllFooterLinkGroupController);

// Get Footer Link Group By ID
router.get("/:id", GetFooterLinkGroupByIdController);

// Update Footer Link Group
router.put("/update/:id", adminSessionMiddleware, UpdateFooterLinkGroupController);

// Delete Footer Link Group
router.delete("/delete/:id", adminSessionMiddleware, DeleteFooterLinkGroupController);

// Change Active Status
router.patch("/status/:id", adminSessionMiddleware, ChangeFooterLinkGroupActiveStatusController);

// Change Display Status
router.patch("/display-status/:id", adminSessionMiddleware, ChangeFooterLinkGroupDisplayStatusController);

export default router;
