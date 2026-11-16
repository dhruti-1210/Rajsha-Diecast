import { Router } from "express";

import {
    CreateFooterLinkGroupController,
    GetAllFooterLinkGroupController,
    GetFooterLinkGroupByIdController,
    UpdateFooterLinkGroupController,
    DeleteFooterLinkGroupController,
    ChangeFooterLinkGroupActiveStatusController
} from "../controller/footerLinkGroupController";

const router = Router();

// Create Footer Link Group
router.post("/create", CreateFooterLinkGroupController);

// Get All Footer Link Groups
router.get("/list", GetAllFooterLinkGroupController);

// Get Footer Link Group By ID
router.get("/:id", GetFooterLinkGroupByIdController);

// Update Footer Link Group
router.put("/update/:id", UpdateFooterLinkGroupController);

// Delete Footer Link Group
router.delete("/delete/:id", DeleteFooterLinkGroupController);

// Change Active Status
router.patch("/status/:id", ChangeFooterLinkGroupActiveStatusController);

export default router;