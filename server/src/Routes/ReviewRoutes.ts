import { Router } from "express";

import {
    CreateReviewsMasterController,
    GetMyReviewsMasterController,
    GetDisplayedReviewsMasterController,
    GetAllReviewsMasterController,
    GetReviewsMasterByIdController,
    UpdateReviewsMasterController,
    DeleteReviewsMasterController,
    ChangeReviewsActiveStatusController,
    ChangeReviewsDisplayStatusController
} from "../controller/ReviewMasterController";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = Router();

// Create Reviews
router.post("/create", authMiddleware, CreateReviewsMasterController);

// Get authenticated user's reviews
router.get("/mine", authMiddleware, GetMyReviewsMasterController);

// Get reviews displayed on the storefront
router.get("/public", GetDisplayedReviewsMasterController);

// Get All Reviews
router.get("/list", GetAllReviewsMasterController);

// Get Reviews By ID
router.get("/:id", GetReviewsMasterByIdController);

// Update Reviews
router.put("/update/:id", UpdateReviewsMasterController);

// Delete Reviews
router.delete("/delete/:id", DeleteReviewsMasterController);

// Change Active Status
router.patch("/status/:id", ChangeReviewsActiveStatusController);

// Change Display Status
router.patch("/display-status/:id", ChangeReviewsDisplayStatusController);

export default router;