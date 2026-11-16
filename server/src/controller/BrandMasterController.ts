
import { Request, Response } from "express";
import {
    CreateCompany,
    GetAllCompanies,
    GetCompanyById,
    UpdateCompany,
    DeleteCompany,
    ChangeActiveStatus
} from "../Services/BrandServices";

// Create Company
export const CreateCompanyController = async (req: Request, res: Response) => {
    try {
        const company = await CreateCompany(req.body);

        return res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: company
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Companies
export const GetAllCompaniesController = async (req: Request, res: Response) => {
    try {
        const companies = await GetAllCompanies();

        return res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            data: companies
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Company By ID
export const GetCompanyByIdController = async (req: Request, res: Response) => {
    try {
        const company = await GetCompanyById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            data: company
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Company
export const UpdateCompanyController = async (req: Request, res: Response) => {
    try {
        const company = await UpdateCompany(req.params.id, req.body);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: company
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Company
export const DeleteCompanyController = async (req: Request, res: Response) => {
    try {
        const company = await DeleteCompany(req.params.id, req.body.updatedBy);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company deleted successfully",
            data: company
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeActiveStatusController = async (req: Request, res: Response) => {
    try {
        const company = await ChangeActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company status changed successfully",
            data: company
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
