import { Request, Response } from "express";

import {
    CreateAdminUserMaster,
    GetAllAdminUserMaster,
    GetAdminUserMasterById,
    UpdateAdminUserMaster,
    DeleteAdminUserMaster
} from "../Services/AdminUserServices";

// Create Admin User
export const CreateAdminUserMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const adminUser = await CreateAdminUserMaster(req.body);

        return res.status(201).json({
            success: true,
            message: "Admin user created successfully",
            data: adminUser
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Admin Users
export const GetAllAdminUserMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const adminUsers = await GetAllAdminUserMaster();

        return res.status(200).json({
            success: true,
            message: "Admin users fetched successfully",
            data: adminUsers
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Admin User By ID
export const GetAdminUserMasterByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const adminUser = await GetAdminUserMasterById(req.params.id);

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin user fetched successfully",
            data: adminUser
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Admin User
export const UpdateAdminUserMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const adminUser = await UpdateAdminUserMaster(
            req.params.id,
            req.body
        );

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin user updated successfully",
            data: adminUser
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Admin User
export const DeleteAdminUserMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const adminUser = await DeleteAdminUserMaster(req.params.id);

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin user deleted successfully",
            data: adminUser
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};