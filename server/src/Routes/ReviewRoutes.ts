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
import {
    adminSessionMiddleware,
    authMiddleware
} from "../middleware/authMiddleWare";

const router = Router();

// Create Reviews
router.post("/create", authMiddleware, CreateReviewsMasterController);

// Get authenticated user's reviews
router.get("/mine", authMiddleware, GetMyReviewsMasterController);

// Get reviews displayed on the storefront
router.get("/public", GetDisplayedReviewsMasterController);

// Get All Reviews
router.get("/list", adminSessionMiddleware, GetAllReviewsMasterController);

// Get Reviews By ID
router.get("/:id", adminSessionMiddleware, GetReviewsMasterByIdController);

// Update Reviews
router.put("/update/:id", adminSessionMiddleware, UpdateReviewsMasterController);

// Delete Reviews
router.delete("/delete/:id", adminSessionMiddleware, DeleteReviewsMasterController);

// Change Active Status
router.patch("/status/:id", adminSessionMiddleware, ChangeReviewsActiveStatusController);

// Change Display Status
router.patch("/display-status/:id", adminSessionMiddleware, ChangeReviewsDisplayStatusController);

export default router;