import { Request, Response } from "express";

import {
    CreateCompanySetup,
    GetAllCompanySetup,
    GetCompanySetupById,
    UpdateCompanySetup,
    DeleteCompanySetup
} from "../Services/CompanySetupServices";

// Create Company Setup
export const CreateCompanySetupController = async (
    req: Request,
    res: Response
) => {
    try {
        const companySetup = await CreateCompanySetup(req.body);

        return res.status(201).json({
            success: true,
            message: "Company setup created successfully",
            data: companySetup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Company Setup
export const GetAllCompanySetupController = async (
    req: Request,
    res: Response
) => {
    try {
        const companySetup = await GetAllCompanySetup();

        return res.status(200).json({
            success: true,
            message: "Company setup fetched successfully",
            data: companySetup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Company Setup By ID
export const GetCompanySetupByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const companySetup = await GetCompanySetupById(req.params.id);

        if (!companySetup) {
            return res.status(404).json({
                success: false,
                message: "Company setup not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company setup fetched successfully",
            data: companySetup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Company Setup
export const UpdateCompanySetupController = async (
    req: Request,
    res: Response
) => {
    try {
        const companySetup = await UpdateCompanySetup(
            req.params.id,
            req.body
        );

        if (!companySetup) {
            return res.status(404).json({
                success: false,
                message: "Company setup not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company setup updated successfully",
            data: companySetup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Company Setup
export const DeleteCompanySetupController = async (
    req: Request,
    res: Response
) => {
    try {
        const companySetup = await DeleteCompanySetup(req.params.id);

        if (!companySetup) {
            return res.status(404).json({
                success: false,
                message: "Company setup not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company setup deleted successfully",
            data: companySetup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};