import { Router } from "express";

import {
    CreateReviewsMasterController,
    GetAllReviewsMasterController,
    GetReviewsMasterByIdController,
    UpdateReviewsMasterController,
    DeleteReviewsMasterController,
    ChangeReviewsActiveStatusController,
    ChangeReviewsDisplayStatusController
} from "../controller/ReviewMasterController";

const router = Router();

// Create Reviews
router.post("/create", CreateReviewsMasterController);

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