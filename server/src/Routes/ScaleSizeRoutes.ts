import { Router } from "express";

import {
    CreateScaleSizeController,
    GetAllScaleSizeController,
    GetScaleSizeByIdController,
    UpdateScaleSizeController,
    DeleteScaleSizeController,
    ChangeScaleSizeActiveStatusController
} from "../controller/ScaleSizeController";

const router = Router();

// Create Scale Size
router.post("/create", CreateScaleSizeController);

// Get All Scale Sizes
router.get("/list", GetAllScaleSizeController);

// Get Scale Size By ID
router.get("/:id", GetScaleSizeByIdController);

// Update Scale Size
router.put("/update/:id", UpdateScaleSizeController);

// Delete Scale Size
router.delete("/delete/:id", DeleteScaleSizeController);

// Change Active Status
router.patch("/status/:id", ChangeScaleSizeActiveStatusController);

export default router;