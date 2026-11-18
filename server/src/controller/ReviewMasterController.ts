import { Request, Response } from "express";
import UserMaster from "../Models/userMaster";

import {
    CreateReviewsMaster,
    GetAllReviewsMaster,
    GetDisplayedReviewsMaster,
    GetReviewsMasterByUserId,
    GetReviewsMasterById,
    UpdateReviewsMaster,
    DeleteReviewsMaster,
    ChangeReviewsActiveStatus,
    ChangeReviewsDisplayStatus
} from "../Services/ReviewMasterServices";

// Create Reviews
export const CreateReviewsMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const message = typeof req.body?.message === "string"
            ? req.body.message.trim()
            : "";
        if (!message || message.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Review message must be between 1 and 2000 characters."
            });
        }

        const authenticatedUser = req.user;
        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "Please log in to submit a review."
            });
        }

        const user = await UserMaster.findOne({
            _id: authenticatedUser.id,
            isDeleted: false,
            isActive: true,
            emailVerified: true
        }).select("name email");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Please log in to submit a review."
            });
        }

        const reviews = await CreateReviewsMaster({
            user_id: user._id,
            name: user.name.trim() || user.email,
            message,
            createdBy: user.email,
            updatedBy: user.email,
            isActive: true,
            isDisplay: true
        });

        return res.status(201).json({
            success: true,
            message: "Reviews created successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetMyReviewsMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please log in to view your reviews."
            });
        }

        const reviews = await GetReviewsMasterByUserId(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Your reviews were fetched successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetDisplayedReviewsMasterController = async (
    _req: Request,
    res: Response
) => {
    try {
        const reviews = await GetDisplayedReviewsMaster();
        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Reviews
export const GetAllReviewsMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const reviews = await GetAllReviewsMaster();

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Reviews By ID
export const GetReviewsMasterByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const reviews = await GetReviewsMasterById(req.params.id);

        if (!reviews) {
            return res.status(404).json({
                success: false,
                message: "Reviews not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Reviews
export const UpdateReviewsMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const reviews = await UpdateReviewsMaster(
            req.params.id,
            req.body
        );

        if (!reviews) {
            return res.status(404).json({
                success: false,
                message: "Reviews not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews updated successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Reviews
export const DeleteReviewsMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const reviews = await DeleteReviewsMaster(
            req.params.id,
            updatedBy
        );

        if (!reviews) {
            return res.status(404).json({
                success: false,
                message: "Reviews not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews deleted successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeReviewsActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const reviews = await ChangeReviewsActiveStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!reviews) {
            return res.status(404).json({
                success: false,
                message: "Reviews not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews active status changed successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Display Status
export const ChangeReviewsDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isDisplay, updatedBy } = req.body;

        const reviews = await ChangeReviewsDisplayStatus(
            req.params.id,
            isDisplay,
            updatedBy
        );

        if (!reviews) {
            return res.status(404).json({
                success: false,
                message: "Reviews not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reviews display status changed successfully",
            data: reviews
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};