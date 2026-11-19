import { Router } from "express";

import {
    CreateScaleSizeController,
    GetAllScaleSizeController,
    GetScaleSizeByIdController,
    UpdateScaleSizeController,
    DeleteScaleSizeController,
    ChangeScaleSizeActiveStatusController
} from "../controller/ScaleSizeController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

// Create Scale Size
router.post("/create", adminSessionMiddleware, CreateScaleSizeController);

// Get All Scale Sizes
router.get("/list", GetAllScaleSizeController);

// Get Scale Size By ID
router.get("/:id", GetScaleSizeByIdController);

// Update Scale Size
router.put("/update/:id", adminSessionMiddleware, UpdateScaleSizeController);

// Delete Scale Size
router.delete("/delete/:id", adminSessionMiddleware, DeleteScaleSizeController);

// Change Active Status
router.patch("/status/:id", adminSessionMiddleware, ChangeScaleSizeActiveStatusController);

export default router;