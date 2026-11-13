
import { Request, Response } from "express";

import {
    createCollectionType,
    getAllCollectionTypes,
    getCollectionTypeById,
    updateCollectionType,
    deleteCollectionType,
    changeCollectionTypeStatus,
    changeCollectionTypeDisplayStatus
} from "../Services/CollectionMasterServices";

// Create Collection Type
export const createCollectionTypeController = async (
    req: Request,
    res: Response
) => {
    try {
        const collectionType = await createCollectionType(req.body);

        return res.status(201).json({
            success: true,
            message: "Collection type created successfully",
            data: collectionType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Collection Types
export const getAllCollectionTypesController = async (
    req: Request,
    res: Response
) => {
    try {
        const collectionTypes = await getAllCollectionTypes();

        return res.status(200).json({
            success: true,
            message: "Collection types fetched successfully",
            data: collectionTypes
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Collection Type By ID
export const getCollectionTypeByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const collectionType = await getCollectionTypeById(
            req.params.id
        );

        if (!collectionType) {
            return res.status(404).json({
                success: false,
                message: "Collection type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Collection type fetched successfully",
            data: collectionType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Collection Type
export const updateCollectionTypeController = async (
    req: Request,
    res: Response
) => {
    try {
        const collectionType = await updateCollectionType(
            req.params.id,
            req.body
        );

        if (!collectionType) {
            return res.status(404).json({
                success: false,
                message: "Collection type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Collection type updated successfully",
            data: collectionType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Collection Type
export const deleteCollectionTypeController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const collectionType = await deleteCollectionType(
            req.params.id,
            updatedBy
        );

        if (!collectionType) {
            return res.status(404).json({
                success: false,
                message: "Collection type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Collection type deleted successfully",
            data: collectionType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Collection Type Status
export const changeCollectionTypeStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const collectionType = await changeCollectionTypeStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!collectionType) {
            return res.status(404).json({
                success: false,
                message: "Collection type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Collection type status changed successfully",
            data: collectionType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Collection Type Display Status
export const changeCollectionTypeDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isDisplay, updatedBy } = req.body;

        const collectionType = await changeCollectionTypeDisplayStatus(
            req.params.id,
            isDisplay,
            updatedBy
        );

        if (!collectionType) {
            return res.status(404).json({
                success: false,
                message: "Collection type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Collection type display status changed successfully",
            data: collectionType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
