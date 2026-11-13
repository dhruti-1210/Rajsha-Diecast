
import { Request, Response } from "express";

import {
    createBudget,
    getAllBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    changeBudgetStatus
} from "../Services/BudgetMasterServices";

// Create Budget
export const createBudgetController = async (
    req: Request,
    res: Response
) => {
    try {
        const budget = await createBudget(req.body);

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: budget
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Budgets
export const getAllBudgetsController = async (
    req: Request,
    res: Response
) => {
    try {
        const budgets = await getAllBudgets();

        return res.status(200).json({
            success: true,
            message: "Budgets fetched successfully",
            data: budgets
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Budget By ID
export const getBudgetByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const budget = await getBudgetById(req.params.id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget fetched successfully",
            data: budget
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Budget
export const updateBudgetController = async (
    req: Request,
    res: Response
) => {
    try {
        const budget = await updateBudget(
            req.params.id,
            req.body
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            data: budget
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Budget
export const deleteBudgetController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const budget = await deleteBudget(
            req.params.id,
            updatedBy
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully",
            data: budget
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Budget Status
export const changeBudgetStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const budget = await changeBudgetStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget status changed successfully",
            data: budget
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
