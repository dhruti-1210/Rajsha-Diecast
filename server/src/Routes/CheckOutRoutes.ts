import { Router } from "express";

import {
    CreateCheckoutController,
    GetAllCheckoutController,
    GetCheckoutByIdController,
    UpdateCheckoutStatusController,
    DeleteCheckoutController
} from "../controller/CheckoutController";
import { adminSessionMiddleware } from "../middleware/authMiddleWare";

const router = Router();

// Create Checkout
router.post("/create", CreateCheckoutController);

// Get All Checkout
router.get("/list", adminSessionMiddleware, GetAllCheckoutController);

// Get Checkout By ID
router.get("/:id", adminSessionMiddleware, GetCheckoutByIdController);

// Update Checkout Status
router.patch("/status/:id", adminSessionMiddleware, UpdateCheckoutStatusController);

// Delete Checkout
router.delete("/delete/:id", adminSessionMiddleware, DeleteCheckoutController);

export default router;