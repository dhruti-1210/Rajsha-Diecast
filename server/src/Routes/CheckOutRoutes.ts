import { Router } from "express";

import {
    CreateCheckoutController,
    GetAllCheckoutController,
    GetCheckoutByIdController,
    UpdateCheckoutStatusController,
    DeleteCheckoutController
} from "../controller/CheckoutController";

const router = Router();

// Create Checkout
router.post("/create", CreateCheckoutController);

// Get All Checkout
router.get("/list", GetAllCheckoutController);

// Get Checkout By ID
router.get("/:id", GetCheckoutByIdController);

// Update Checkout Status
router.patch("/status/:id", UpdateCheckoutStatusController);

// Delete Checkout
router.delete("/delete/:id", DeleteCheckoutController);

export default router;