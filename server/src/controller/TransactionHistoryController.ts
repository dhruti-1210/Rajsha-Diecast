import { Request, Response } from "express";

import {
    CreateTransactionHistory,
    GetAllTransactionHistory,
    GetTransactionHistoryById,
    UpdateTransactionHistory,
    DeleteTransactionHistory,
    ChangeTransactionActiveStatus,
    ChangeTransactionDisplayStatus
} from "../Services/TransactionHistoryServices";

// Create Transaction History
export const CreateTransactionHistoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const transaction = await CreateTransactionHistory(req.body);

        return res.status(201).json({
            success: true,
            message: "Transaction history created successfully",
            data: transaction
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Transaction History
export const GetAllTransactionHistoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const transactions = await GetAllTransactionHistory();

        return res.status(200).json({
            success: true,
            message: "Transaction history fetched successfully",
            data: transactions
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Transaction History By ID
export const GetTransactionHistoryByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const transaction = await GetTransactionHistoryById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction history not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction history fetched successfully",
            data: transaction
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Transaction History
export const UpdateTransactionHistoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const transaction = await UpdateTransactionHistory(
            req.params.id,
            req.body
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction history not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction history updated successfully",
            data: transaction
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Transaction History
export const DeleteTransactionHistoryController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const transaction = await DeleteTransactionHistory(
            req.params.id,
            updatedBy
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction history not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction history deleted successfully",
            data: transaction
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeTransactionActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const transaction = await ChangeTransactionActiveStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction history not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction active status changed successfully",
            data: transaction
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Display Status
export const ChangeTransactionDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isDisplay, updatedBy } = req.body;

        const transaction = await ChangeTransactionDisplayStatus(
            req.params.id,
            isDisplay,
            updatedBy
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction history not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction display status changed successfully",
            data: transaction
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};